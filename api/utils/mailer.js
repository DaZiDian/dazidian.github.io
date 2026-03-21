import nodemailer from 'nodemailer';

export const DEFAULT_MAIL_SUBJECT_TEMPLATE = '{{nickname}} - {{site_name}} - 友链申请';

export const DEFAULT_ADMIN_MAIL_TEMPLATE = `您好，管理员：\n\n收到新的友情链接申请，请及时审核。\n\n昵称：{{nickname}}\n站点名称：{{site_name}}\n站点链接：{{site_url}}\n联系邮箱：{{contact_email}}\n用户申请留言：{{application_message}}\n\nDaZiDian & DSMCC ©2007-present All Copyrights Reserved.`;

export const DEFAULT_REVIEW_MAIL_TEMPLATE = `您好，您在dz1d.vip申请的友情链接现已{{review_status}}\n附言：\n{{admin_note}}\nDaZiDian & DSMCC ©2007-present All Copyrights Reserved.`;

const isBlank = (value) => !String(value || '').trim();

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const nl2br = (value = '') => escapeHtml(value).replace(/\n/g, '<br />');

const renderTemplate = (template = '', payload = {}) =>
  String(template).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const raw = payload[key];
    return raw === undefined || raw === null ? '' : String(raw);
  });

const buildReviewStatusHtml = (status = '') => {
  if (status === 'approved') {
    return '<strong style="color:#16a34a;">通过</strong>';
  }
  if (status === 'rejected') {
    return '<strong style="color:#dc2626;">未通过</strong>';
  }
  return '<strong style="color:#d97706;">请检查您的站点</strong>';
};

const buildReviewStatusText = (status = '') => {
  if (status === 'approved') return '通过';
  if (status === 'rejected') return '未通过';
  return '请检查您的站点';
};

const baseMailHtml = (title, bodyHtml) => `
  <div style="margin:0;padding:0;background:#f3f6fb;font-family:'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:24px;">
      <div style="background:#1a1b26;color:#ffffff;padding:14px 18px;border-radius:14px 14px 0 0;font-weight:700;font-size:16px;">
        ${escapeHtml(title)}
      </div>
      <div style="background:#ffffff;border:1px solid #d9e2f0;border-top:none;border-radius:0 0 14px 14px;padding:22px 20px;color:#1f2937;line-height:1.9;font-size:14px;">
        ${bodyHtml}
      </div>
    </div>
  </div>
`;

const getSmtpConfig = async (sql) => {
  const result = await sql`
    SELECT *
    FROM mail_settings
    WHERE protocol = 'smtp'
    LIMIT 1
  `;
  const rows = result.rows || result;
  return rows[0] || null;
};

const createTransport = (smtpConfig) => {
  if (!smtpConfig) return null;
  if (!smtpConfig.enabled) return null;
  if (isBlank(smtpConfig.host) || !Number(smtpConfig.port) || isBlank(smtpConfig.username) || isBlank(smtpConfig.password)) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: Number(smtpConfig.port),
    secure: Boolean(smtpConfig.secure),
    auth: {
      user: smtpConfig.username,
      pass: smtpConfig.password,
    },
  });
};

const sendMailSafely = async ({ smtpConfig, to, subject, plainBody, htmlBody }) => {
  try {
    const transporter = createTransport(smtpConfig);
    if (!transporter) {
      return {
        sent: false,
        reason: 'SMTP 未启用或配置不完整',
      };
    }

    if (isBlank(to)) {
      return {
        sent: false,
        reason: '收件人邮箱为空',
      };
    }

    const fromName = String(smtpConfig.from_name || 'DaZiDian');
    const fromAddress = String(smtpConfig.from_email || smtpConfig.username || '').trim();
    if (isBlank(fromAddress)) {
      return {
        sent: false,
        reason: '发件人邮箱未配置',
      };
    }

    const info = await transporter.sendMail({
      from: `"${fromName.replace(/"/g, '\\"')}" <${fromAddress}>`,
      to,
      subject,
      text: plainBody,
      html: htmlBody,
    });

    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('邮件发送失败:', error);
    return {
      sent: false,
      reason: error.message || '邮件发送失败',
    };
  }
};

export const sendFriendApplicationToAdmin = async ({ sql, friend }) => {
  const smtpConfig = await getSmtpConfig(sql);
  if (!smtpConfig) {
    return {
      sent: false,
      reason: '未找到 SMTP 配置',
    };
  }

  const subjectTemplate = String(smtpConfig.subject_template || DEFAULT_MAIL_SUBJECT_TEMPLATE);
  const adminTemplate = String(smtpConfig.admin_template || DEFAULT_ADMIN_MAIL_TEMPLATE);
  const adminReceiver = String(smtpConfig.admin_receiver_email || '').trim();

  const payload = {
    nickname: String(friend.nickname || '游客'),
    site_name: String(friend.site_name || ''),
    site_url: String(friend.site_url || ''),
    contact_email: String(friend.contact_email || ''),
    application_message: String(friend.application_message || '（无）'),
  };

  const subject = renderTemplate(subjectTemplate, payload);
  const plainBody = renderTemplate(adminTemplate, payload);
  const htmlBody = baseMailHtml(
    '友情链接申请通知',
    `<div>${nl2br(plainBody)}</div>`
  );

  return sendMailSafely({
    smtpConfig,
    to: adminReceiver,
    subject,
    plainBody,
    htmlBody,
  });
};

export const sendFriendReviewToUser = async ({ sql, friend }) => {
  const smtpConfig = await getSmtpConfig(sql);
  if (!smtpConfig) {
    return {
      sent: false,
      reason: '未找到 SMTP 配置',
    };
  }

  const userEmail = String(friend.contact_email || '').trim();
  if (isBlank(userEmail)) {
    return {
      sent: false,
      reason: '用户邮箱为空，跳过发送',
    };
  }

  const subjectTemplate = String(smtpConfig.subject_template || DEFAULT_MAIL_SUBJECT_TEMPLATE);
  const reviewTemplate = String(smtpConfig.review_template || DEFAULT_REVIEW_MAIL_TEMPLATE);

  const adminNote = String(friend.admin_note || '').trim() || (friend.status === 'approved' ? '已通过并添加' : '不予通过');

  const payload = {
    nickname: String(friend.nickname || '游客'),
    site_name: String(friend.site_name || ''),
    review_status: buildReviewStatusText(friend.status),
    admin_note: adminNote,
  };

  const subject = renderTemplate(subjectTemplate, payload);
  const plainBody = renderTemplate(reviewTemplate, payload);

  const reviewBodyHtml = `
    <p style="margin:0 0 12px;">您好，您在dz1d.vip申请的友情链接现已${buildReviewStatusHtml(friend.status)}</p>
    <p style="margin:0 0 6px;"><strong>附言：</strong></p>
    <p style="margin:0 0 16px;">${nl2br(adminNote)}</p>
    <p style="margin:16px 0 0;color:#64748b;">DaZiDian & DSMCC ©2007-present All Copyrights Reserved.</p>
  `;

  const htmlBody = baseMailHtml(
    '友情链接审核结果通知',
    reviewBodyHtml
  );

  return sendMailSafely({
    smtpConfig,
    to: userEmail,
    subject,
    plainBody,
    htmlBody,
  });
};
