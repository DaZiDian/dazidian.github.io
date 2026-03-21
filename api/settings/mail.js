import { authenticateRequest } from '../utils/auth.js';
import {
  DEFAULT_ADMIN_MAIL_TEMPLATE,
  DEFAULT_MAIL_SUBJECT_TEMPLATE,
  DEFAULT_REVIEW_MAIL_TEMPLATE,
} from '../utils/mailer.js';

const SUPPORTED_PROTOCOLS = ['smtp', 'imap', 'pop3'];

const toInt = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value, fallback = false) => {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return fallback;
};

const normalizeProtocol = (value = '') => String(value || '').trim().toLowerCase();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!['GET', 'PUT'].includes(req.method)) {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  const authResult = authenticateRequest(req);
  if (!authResult) {
    return res.status(401).json({
      success: false,
      error: '未授权，请先登录',
    });
  }

  try {
    const { getDatabaseClient } = await import('../utils/db.js');
    const db = await getDatabaseClient();
    const sql = db.sql;
    const pool = db.pool;

    await sql`
      CREATE TABLE IF NOT EXISTS mail_settings (
        id SERIAL PRIMARY KEY,
        protocol VARCHAR(20) UNIQUE NOT NULL,
        enabled BOOLEAN DEFAULT FALSE,
        host VARCHAR(255),
        port INT DEFAULT 0,
        secure BOOLEAN DEFAULT FALSE,
        username VARCHAR(255),
        password TEXT,
        from_name VARCHAR(255),
        from_email VARCHAR(255),
        admin_receiver_email VARCHAR(255),
        subject_template TEXT,
        admin_template TEXT,
        review_template TEXT,
        inbox_folder VARCHAR(255),
        poll_interval INT DEFAULT 5,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    if (pool) {
      await pool.query(`
        ALTER TABLE mail_settings
        ADD COLUMN IF NOT EXISTS admin_receiver_email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS subject_template TEXT,
        ADD COLUMN IF NOT EXISTS admin_template TEXT,
        ADD COLUMN IF NOT EXISTS review_template TEXT,
        ADD COLUMN IF NOT EXISTS inbox_folder VARCHAR(255),
        ADD COLUMN IF NOT EXISTS poll_interval INT DEFAULT 5
      `);
    }

    // 自动补齐三种协议记录，便于前端配置界面一次展示
    await sql`
      INSERT INTO mail_settings (protocol, enabled, port, secure, poll_interval, updated_at)
      VALUES
        ('smtp', FALSE, 587, FALSE, 5, CURRENT_TIMESTAMP),
        ('imap', FALSE, 993, TRUE, 5, CURRENT_TIMESTAMP),
        ('pop3', FALSE, 995, TRUE, 5, CURRENT_TIMESTAMP)
      ON CONFLICT (protocol) DO NOTHING
    `;

    await sql`
      UPDATE mail_settings
      SET
        from_name = COALESCE(NULLIF(from_name, ''), 'DaZiDian'),
        from_email = COALESCE(NULLIF(from_email, ''), 'dazidian2007@163.com'),
        admin_receiver_email = COALESCE(NULLIF(admin_receiver_email, ''), 'dazidian@vip.qq.com'),
        subject_template = COALESCE(NULLIF(subject_template, ''), ${DEFAULT_MAIL_SUBJECT_TEMPLATE}),
        admin_template = COALESCE(NULLIF(admin_template, ''), ${DEFAULT_ADMIN_MAIL_TEMPLATE}),
        review_template = COALESCE(NULLIF(review_template, ''), ${DEFAULT_REVIEW_MAIL_TEMPLATE}),
        updated_at = CURRENT_TIMESTAMP
      WHERE protocol = 'smtp'
    `;

    if (req.method === 'GET') {
      const result = await sql`
        SELECT
          id,
          protocol,
          enabled,
          host,
          port,
          secure,
          username,
          CASE WHEN password IS NULL OR password = '' THEN FALSE ELSE TRUE END AS has_password,
          from_name,
          from_email,
          admin_receiver_email,
          subject_template,
          admin_template,
          review_template,
          inbox_folder,
          poll_interval,
          updated_at
        FROM mail_settings
        ORDER BY
          CASE protocol
            WHEN 'smtp' THEN 1
            WHEN 'imap' THEN 2
            WHEN 'pop3' THEN 3
            ELSE 99
          END ASC
      `;

      const rows = result.rows || result;
      return res.status(200).json({
        success: true,
        data: rows,
        supportedProtocols: SUPPORTED_PROTOCOLS,
      });
    }

    const {
      protocol,
      enabled,
      host,
      port,
      secure,
      username,
      password,
      from_name,
      from_email,
      admin_receiver_email,
      subject_template,
      admin_template,
      review_template,
      inbox_folder,
      poll_interval,
    } = req.body || {};

    const normalizedProtocol = normalizeProtocol(protocol);
    if (!SUPPORTED_PROTOCOLS.includes(normalizedProtocol)) {
      return res.status(400).json({
        success: false,
        error: '协议类型不支持，仅支持 SMTP / IMAP / POP3',
      });
    }

    const currentResult = await sql`
      SELECT password
      FROM mail_settings
      WHERE protocol = ${normalizedProtocol}
      LIMIT 1
    `;
    const currentRows = currentResult.rows || currentResult;
    const existingPassword = currentRows[0]?.password || '';

    const finalPassword = String(password || '').trim()
      ? String(password).trim()
      : existingPassword;

    const upsertResult = await sql`
      INSERT INTO mail_settings (
        protocol,
        enabled,
        host,
        port,
        secure,
        username,
        password,
        from_name,
        from_email,
        admin_receiver_email,
        subject_template,
        admin_template,
        review_template,
        inbox_folder,
        poll_interval,
        updated_at
      )
      VALUES (
        ${normalizedProtocol},
        ${toBool(enabled, false)},
        ${String(host || '').trim()},
        ${toInt(port, normalizedProtocol === 'smtp' ? 587 : normalizedProtocol === 'imap' ? 993 : 995)},
        ${toBool(secure, normalizedProtocol !== 'smtp')},
        ${String(username || '').trim()},
        ${finalPassword},
        ${String(from_name || '').trim()},
        ${String(from_email || '').trim()},
        ${String(admin_receiver_email || '').trim()},
        ${String(subject_template || '').trim()},
        ${String(admin_template || '').trim()},
        ${String(review_template || '').trim()},
        ${String(inbox_folder || '').trim()},
        ${toInt(poll_interval, 5)},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (protocol) DO UPDATE SET
        enabled = EXCLUDED.enabled,
        host = EXCLUDED.host,
        port = EXCLUDED.port,
        secure = EXCLUDED.secure,
        username = EXCLUDED.username,
        password = EXCLUDED.password,
        from_name = EXCLUDED.from_name,
        from_email = EXCLUDED.from_email,
        admin_receiver_email = EXCLUDED.admin_receiver_email,
        subject_template = EXCLUDED.subject_template,
        admin_template = EXCLUDED.admin_template,
        review_template = EXCLUDED.review_template,
        inbox_folder = EXCLUDED.inbox_folder,
        poll_interval = EXCLUDED.poll_interval,
        updated_at = CURRENT_TIMESTAMP
      RETURNING
        id,
        protocol,
        enabled,
        host,
        port,
        secure,
        username,
        CASE WHEN password IS NULL OR password = '' THEN FALSE ELSE TRUE END AS has_password,
        from_name,
        from_email,
        admin_receiver_email,
        subject_template,
        admin_template,
        review_template,
        inbox_folder,
        poll_interval,
        updated_at
    `;

    const upsertRows = upsertResult.rows || upsertResult;
    return res.status(200).json({
      success: true,
      data: upsertRows[0],
      message: `${normalizedProtocol.toUpperCase()} 配置已更新`,
    });
  } catch (error) {
    console.error('Mail settings API error:', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误，请稍后再试',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
