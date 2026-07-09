// 认证工具函数
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// JWT 密钥 - 从环境变量获取
// 安全: 符合等保3.0 - 密钥不得硬编码
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('安全错误: 生产环境必须设置 JWT_SECRET 环境变量');
}
const EFFECTIVE_JWT_SECRET = JWT_SECRET || 'dev_only_jwt_secret_DO_NOT_USE_IN_PRODUCTION_' + Date.now();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // token 有效期

// 密码哈希盐值 - 从环境变量获取
const PASSWORD_SALT = process.env.PASSWORD_SALT;
if (!PASSWORD_SALT && process.env.NODE_ENV === 'production') {
  throw new Error('安全错误: 生产环境必须设置 PASSWORD_SALT 环境变量');
}
const EFFECTIVE_PASSWORD_SALT = PASSWORD_SALT || 'dev_only_salt_DO_NOT_USE_IN_PRODUCTION_' + Date.now();

/**
 * 使用 SHA-256 哈希密码
 * @param {string} password - 明文密码
 * @returns {string} 哈希后的密码（hex格式）
 */
export function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + EFFECTIVE_PASSWORD_SALT)
    .digest('hex');
}

/**
 * 验证密码
 * @param {string} password - 用户输入的明文密码
 * @param {string} hashedPassword - 存储的哈希密码
 * @returns {boolean} 密码是否匹配
 */
export function verifyPassword(password, hashedPassword) {
  const hashed = hashPassword(password);
  
  // 如果长度不同，直接返回 false（避免 timingSafeEqual 报错）
  if (hashed.length !== hashedPassword.length) {
    return false;
  }
  
  // 使用时间安全的比较函数防止时序攻击
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hashed, 'hex'),
      Buffer.from(hashedPassword, 'hex')
    );
  } catch (error) {
    // 如果比较失败，返回 false
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * 生成 JWT token
 * @param {object} payload - token 载荷
 * @returns {string} JWT token
 */
export function generateToken(payload = {}) {
  return jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000), // 签发时间
    },
    EFFECTIVE_JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

/**
 * 验证 JWT token
 * @param {string} token - JWT token
 * @returns {object|null} 解码后的 token 载荷，如果无效则返回 null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, EFFECTIVE_JWT_SECRET);
  } catch (error) {
    // 安全: 不记录具体的 token 验证失败原因
    return null;
  }
}

/**
 * 从请求头中提取 token
 * @param {object} req - 请求对象
 * @returns {string|null} token 或 null
 */
export function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * 认证中间件 - 验证请求是否已认证
 * @param {object} req - 请求对象
 * @returns {object|null} 解码后的 token 载荷，如果未认证则返回 null
 */
export function authenticateRequest(req) {
  const token = extractToken(req);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

/**
 * 获取存储的密码哈希值（从环境变量）
 * @returns {string} 密码哈希值
 */
export function getStoredPasswordHash() {
  // 从环境变量获取密码哈希
  // 如果环境变量中没有，则使用默认密码的哈希（仅用于开发）
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash) {
    return envHash;
  }
  
  // 开发环境默认密码的哈希（生产环境必须设置环境变量）
  console.warn('警告: 使用默认密码哈希，生产环境请设置 ADMIN_PASSWORD_HASH 环境变量');
  return hashPassword('dazidian2024');
}

