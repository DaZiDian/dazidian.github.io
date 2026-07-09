import { authenticateRequest } from '../utils/auth.js';
import {
  sendFriendApplicationToAdmin,
  sendFriendReviewToUser,
} from '../utils/mailer.js';

const ALLOWED_STATUS = new Set(['pending', 'approved', 'rejected']);

const parseBoolean = (value, fallback = false) => {
  if (value === true || value === 'true' || value === 1 || value === '1') {
    return true;
  }
  if (value === false || value === 'false' || value === 0 || value === '0') {
    return false;
  }
  return fallback;
};

const normalizeUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  return `https://${raw}`;
};

const isValidEmail = (value = '') => {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 安全: 安全响应头 - 符合等保3.0
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 管理操作强制鉴权
  if (['PUT', 'DELETE'].includes(req.method)) {
    const authResult = authenticateRequest(req);
    if (!authResult) {
      return res.status(401).json({
        success: false,
        error: '未授权，请先登录',
      });
    }
  }

  // GET 支持 admin=1 查看全部数据，也需要鉴权
  if (req.method === 'GET' && parseBoolean(req.query.admin, false)) {
    const authResult = authenticateRequest(req);
    if (!authResult) {
      return res.status(401).json({
        success: false,
        error: '未授权，请先登录',
      });
    }
  }

  try {
    const { getDatabaseClient } = await import('../utils/db.js');
    const db = await getDatabaseClient();
    const sql = db.sql;
    const pool = db.pool;

    await sql`
      CREATE TABLE IF NOT EXISTS friend_links (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(100) DEFAULT '匿名站长',
        site_name VARCHAR(200) NOT NULL,
        site_url TEXT NOT NULL,
        site_description TEXT,
        application_message TEXT,
        contact_email VARCHAR(255),
        logo_url TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        admin_note TEXT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 兼容旧库：补充可能缺失的字段
    if (pool) {
      await pool.query(`
        ALTER TABLE friend_links
        ADD COLUMN IF NOT EXISTS application_message TEXT,
        ADD COLUMN IF NOT EXISTS admin_note TEXT,
        ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
    }

    if (req.method === 'GET') {
      const isAdminQuery = parseBoolean(req.query.admin, false);
      const viewType = String(req.query.view || '').trim().toLowerCase();
      const statusFilter = String(req.query.status || '').trim().toLowerCase();
      let result;
      if (!isAdminQuery && viewType === 'applications') {
        result = await sql`
          SELECT
            id,
            nickname,
          site_name,
          site_url,
          application_message,
          status,
          admin_note,
          created_at,
            updated_at
          FROM friend_links
          ORDER BY
            created_at DESC
          LIMIT 200
        `;
      } else if (!isAdminQuery) {
        result = await sql`
          SELECT *
          FROM friend_links
          WHERE status = 'approved'
          ORDER BY
            display_order ASC,
            updated_at DESC NULLS LAST,
            created_at DESC
          LIMIT 200
        `;
      } else if (statusFilter && ALLOWED_STATUS.has(statusFilter)) {
        result = await sql`
          SELECT *
          FROM friend_links
          WHERE status = ${statusFilter}
          ORDER BY
            display_order ASC,
            updated_at DESC NULLS LAST,
            created_at DESC
          LIMIT 200
        `;
      } else {
        result = await sql`
          SELECT *
          FROM friend_links
          ORDER BY
            display_order ASC,
            updated_at DESC NULLS LAST,
            created_at DESC
          LIMIT 200
        `;
      }

      const rows = result.rows || result;

      return res.status(200).json({
        success: true,
        data: rows,
      });
    }

    if (req.method === 'POST') {
      const {
        nickname,
        site_name,
        site_url,
        site_description,
        application_message,
        contact_email,
        logo_url,
      } = req.body || {};

      const normalizedSiteName = String(site_name || '').trim();
      const normalizedUrl = normalizeUrl(site_url);
      const normalizedEmail = String(contact_email || '').trim();
      const normalizedApplicationMessage = String(application_message || '').trim();

      if (!normalizedSiteName) {
        return res.status(400).json({
          success: false,
          error: '站点名称不能为空',
        });
      }

      if (!normalizedUrl) {
        return res.status(400).json({
          success: false,
          error: '站点链接不能为空',
        });
      }

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          error: '联系邮箱格式不正确',
        });
      }

      const result = await sql`
        INSERT INTO friend_links (
          nickname,
          site_name,
          site_url,
          site_description,
          application_message,
          contact_email,
          logo_url,
          status,
          admin_note,
          display_order
        )
        VALUES (
          ${String(nickname || '').trim() || '匿名站长'},
          ${normalizedSiteName},
          ${normalizedUrl},
          ${String(site_description || '').trim()},
          ${normalizedApplicationMessage},
          ${normalizedEmail},
          ${String(logo_url || '').trim()},
          'pending',
          '',
          0
        )
        RETURNING *
      `;

      const rows = result.rows || result;
      let mailDelivery = null;

      try {
        mailDelivery = await sendFriendApplicationToAdmin({
          sql,
          friend: rows[0],
        });
      } catch (mailError) {
        console.error('管理员通知邮件发送异常:', mailError);
      }

      return res.status(201).json({
        success: true,
        data: rows[0],
        message: '友链申请已提交，等待审核',
        mail: mailDelivery,
      });
    }

    if (req.method === 'PUT') {
      const {
        id,
        nickname,
        site_name,
        site_url,
        site_description,
        application_message,
        contact_email,
        logo_url,
        status,
        admin_note,
        display_order,
      } = req.body || {};

      if (!id) {
        return res.status(400).json({
          success: false,
          error: '友链 ID 不能为空',
        });
      }

      const existingResult = await sql`
        SELECT *
        FROM friend_links
        WHERE id = ${id}
        LIMIT 1
      `;
      const existingRows = existingResult.rows || existingResult;
      if (!existingRows.length) {
        return res.status(404).json({
          success: false,
          error: '友链记录不存在',
        });
      }
      const existing = existingRows[0];

      const nextNickname = nickname !== undefined
        ? (String(nickname || '').trim() || '匿名站长')
        : (String(existing.nickname || '').trim() || '匿名站长');
      const nextSiteName = site_name !== undefined
        ? String(site_name || '').trim()
        : String(existing.site_name || '').trim();
      const nextSiteUrl = site_url !== undefined
        ? normalizeUrl(site_url)
        : String(existing.site_url || '').trim();
      const nextSiteDescription = site_description !== undefined
        ? String(site_description || '').trim()
        : String(existing.site_description || '').trim();
      const nextApplicationMessage = application_message !== undefined
        ? String(application_message || '').trim()
        : String(existing.application_message || '').trim();
      const nextEmail = contact_email !== undefined
        ? String(contact_email || '').trim()
        : String(existing.contact_email || '').trim();
      const nextLogoUrl = logo_url !== undefined
        ? String(logo_url || '').trim()
        : String(existing.logo_url || '').trim();
      const nextStatus = status !== undefined
        ? String(status || '').trim().toLowerCase()
        : String(existing.status || 'pending').trim().toLowerCase();
      const nextAdminNote = admin_note !== undefined
        ? String(admin_note || '').trim()
        : String(existing.admin_note || '').trim();
      const nextDisplayOrder = display_order !== undefined
        ? (Number.isFinite(Number(display_order)) ? Number(display_order) : 0)
        : (Number.isFinite(Number(existing.display_order)) ? Number(existing.display_order) : 0);

      if (!nextSiteName) {
        return res.status(400).json({
          success: false,
          error: '站点名称不能为空',
        });
      }

      if (!nextSiteUrl) {
        return res.status(400).json({
          success: false,
          error: '站点链接不能为空',
        });
      }

      if (!ALLOWED_STATUS.has(nextStatus)) {
        return res.status(400).json({
          success: false,
          error: '状态不合法',
        });
      }

      if (!isValidEmail(nextEmail)) {
        return res.status(400).json({
          success: false,
          error: '联系邮箱格式不正确',
        });
      }

      const result = await sql`
        UPDATE friend_links
        SET
          nickname = ${nextNickname},
          site_name = ${nextSiteName},
          site_url = ${nextSiteUrl},
          site_description = ${nextSiteDescription},
          application_message = ${nextApplicationMessage},
          contact_email = ${nextEmail},
          logo_url = ${nextLogoUrl},
          status = ${nextStatus},
          admin_note = ${nextAdminNote},
          display_order = ${nextDisplayOrder},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;

      const rows = result.rows || result;
      let mailDelivery = null;
      const newStatus = rows[0]?.status;
      const oldStatus = String(existing.status || '').toLowerCase();

      if (newStatus !== oldStatus && ['approved', 'rejected'].includes(newStatus)) {
        try {
          mailDelivery = await sendFriendReviewToUser({
            sql,
            friend: rows[0],
          });
        } catch (mailError) {
          console.error('用户结果通知邮件发送异常:', mailError);
        }
      }

      return res.status(200).json({
        success: true,
        data: rows[0],
        mail: mailDelivery,
      });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query || {};
      if (!id) {
        return res.status(400).json({
          success: false,
          error: '友链 ID 不能为空',
        });
      }

      const result = await sql`
        DELETE FROM friend_links
        WHERE id = ${id}
        RETURNING id
      `;

      const rows = result.rows || result;
      if (!rows.length) {
        return res.status(404).json({
          success: false,
          error: '友链记录不存在',
        });
      }

      return res.status(200).json({
        success: true,
        message: '友链记录已删除',
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    // 安全: 不泄露敏感的内部错误信息 - 符合等保3.0
    console.error('Friends API error:', error.message);
    return res.status(500).json({
      success: false,
      error: '服务器错误，请稍后再试'
    });
  }
}
