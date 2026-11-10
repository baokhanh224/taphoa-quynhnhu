import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Chưa đăng nhập!' }, { status: 401 });
  }

  try {
    await resetDatabase();
    return NextResponse.json({
      success: true,
      message: 'Khôi phục dữ liệu mẫu thành công!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Lỗi khi khôi phục dữ liệu mẫu' },
      { status: 500 }
    );
  }
}
