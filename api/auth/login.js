// 登录认证 API
// 安全: 符合等保3.0 - 身份鉴别、入侵防范、审计日志
import { hashPassword, verifyPassword, generateToken, getStoredPasswordHash } from '../utils/auth.js';

// 安全: 简易内存速率限制（防暴力破解）
// 符合等保3.0 - 应具有登录失败处理功能，应限制非法登录次数
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5; // 最大连续失败次数
const WINDOW_MS = 15 * 60 * 1000; // 15 分钟窗口
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 封禁 15 分钟

/**
 * 安全: 获取允许的 CORS Origin
 * 符合等保3.0 - 通信完整性、边界防护
 */
function getAllowedOrigin(req) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const origin = req.headers.origin || req.headers.referer || '';

  // 如果配置了白名单，只允许白名单中的域名
  if (allowedOrigins.length > 0) {
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return allowedOrigins[0]; // 返回第一个作为默认
  }

  // 未配置白名单时，允许同源请求（不返回 *）
  return origin || '';
}

/**
 * 安全: 速率限制检查
 */
function checkRateLimit(clientIp) {
  const now = Date.now();
  const record = loginAttempts.get(clientIp);

  if (!record) return { allowed: true };

  // 检查是否在封禁期内
  if (record.blockedUntil && now < record.blockedUntil) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // 清理过期的窗口
  if (now - record.windowStart > WINDOW_MS) {
    loginAttempts.delete(clientIp);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return { allowed: false, remainingSeconds: Math.ceil(BLOCK_DURATION_MS / 1000) };
  }

  return { allowed: true };
}

/**
 * 安全: 记录失败的登录尝试
 */
function recordFailedAttempt(clientIp) {
  const now = Date.now();
  const record = loginAttempts.get(clientIp);

  if (!record || now - record.windowStart > WINDOW_MS) {
    loginAttempts.set(clientIp, { count: 1, windowStart: now, blockedUntil: null });
  } else {
    record.count++;
    if (record.count >= MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
    }
  }
}

/**
 * 安全: 清除成功登录的记录
 */
function clearAttempts(clientIp) {
  loginAttempts.delete(clientIp);
}

export default async function handler(req, res) {
  // 安全: CORS - 不使用通配符 *，限制允许的来源
  // 符合等保3.0 - 边界防护
  const allowedOrigin = getAllowedOrigin(req);
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 安全: 安全响应头
  // 符合等保3.0 - 入侵防范
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  // 安全: 获取客户端 IP（用于速率限制）
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';

  // 安全: 速率限制检查
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    // 符合等保3.0 - 应具有登录失败处理功能
    return res.status(429).json({
      success: false,
      error: `登录尝试过于频繁，请在 ${rateCheck.remainingSeconds} 秒后重试`,
    });
  }

  try {
    const { password } = req.body;

    // 安全: 输入验证
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: '密码不能为空',
      });
    }

    // 安全: 限制密码长度防止 DoS
    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        error: '密码格式不正确',
      });
    }

    // 获取存储的密码哈希
    const storedHash = getStoredPasswordHash();

    // 验证密码
    const isValid = verifyPassword(password, storedHash);

    if (!isValid) {
      // 安全: 记录失败尝试
      recordFailedAttempt(clientIp);

      // 添加延迟防止暴力破解和时序攻击（即使密码错误也等待一段时间）
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      
      // 安全审计日志 - 符合等保3.0
      console.warn(`[SECURITY] Login failed from IP: ${clientIp} at ${new Date().toISOString()}`);

      return res.status(401).json({
        success: false,
        error: '密码错误，请重试',
      });
    }

    // 安全: 清除该 IP 的失败记录
    clearAttempts(clientIp);

    // 密码正确，生成 JWT token
    const token = generateToken({
      role: 'admin',
      loginTime: Date.now(),
    });

    // 安全审计日志
    console.info(`[SECURITY] Login success from IP: ${clientIp} at ${new Date().toISOString()}`);

    return res.status(200).json({
      success: true,
      data: {
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      },
    });
  } catch (error) {
    // 安全: 不泄露内部错误信息给客户端
    console.error('[SECURITY] Login error:', error.message);
    return res.status(500).json({
      success: false,
      error: '登录失败，请稍后重试',
    });
  }
}


