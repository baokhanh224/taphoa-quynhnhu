import { NextResponse } from 'next/server';
import { getAccountByUsername } from '@/lib/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { tenDangNhap, matKhau } = await req.json();

    if (!tenDangNhap || !matKhau) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên đăng nhập và mật khẩu!' },
        { status: 400 }
      );
    }

    const account = await getAccountByUsername(tenDangNhap.trim());
    if (!account) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(matKhau, account.matKhau);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' },
        { status: 401 }
      );
    }

    const token = createSessionToken(account);
    const res = NextResponse.json({
      success: true,
      user: {
        maTaiKhoan: account.maTaiKhoan,
        tenDangNhap: account.tenDangNhap,
        role: 'Chủ cửa hàng',
      },
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi đăng nhập' }, { status: 500 });
  }
}
