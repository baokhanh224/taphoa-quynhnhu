import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'quynhnhu_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'quynhnhu_default_secret_key_2026';

export interface UserSession {
  maTaiKhoan: string;
  tenDangNhap: string;
  role: string;
  expiresAt: number;
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// Simple signed session token
export function createSessionToken(user: { maTaiKhoan: string; tenDangNhap: string }): string {
  const payload: UserSession = {
    maTaiKhoan: user.maTaiKhoan,
    tenDangNhap: user.tenDangNhap,
    role: 'Chủ cửa hàng',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json).toString('base64url');
  // Simple checksum signature
  const sig = Buffer.from(`${base64}.${SESSION_SECRET}`).toString('base64url');
  return `${base64}.${sig}`;
}

export function parseSessionToken(token: string): UserSession | null {
  try {
    const [base64, sig] = token.split('.');
    if (!base64 || !sig) return null;
    const expectedSig = Buffer.from(`${base64}.${SESSION_SECRET}`).toString('base64url');
    if (sig !== expectedSig) return null;
    const json = Buffer.from(base64, 'base64url').toString('utf-8');
    const session: UserSession = JSON.parse(json);
    if (Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return parseSessionToken(token);
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
