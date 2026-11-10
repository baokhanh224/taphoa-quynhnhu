import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, createCustomer, getCustomerByPhone } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  if (switches.errorLoad) {
    return NextResponse.json({ error: 'Không thể tải dữ liệu khách hàng' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || undefined;

  try {
    const customers = await getCustomers(keyword);
    return NextResponse.json({ customers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const switches = getDemoSwitches(req);
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu thông tin khách hàng' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { tenKhachHang, soDienThoai, diaChi } = body;

    // UC5.1 5a.1: Bỏ trống thông tin bắt buộc
    if (!tenKhachHang || !tenKhachHang.trim() || !soDienThoai || !soDienThoai.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Tên khách hàng và Số điện thoại' },
        { status: 400 }
      );
    }

    // UC5.1 5b.1: Thông tin nhập sai định dạng: số điện thoại 10 số bắt đầu bằng 0
    const cleanPhone = soDienThoai.trim();
    if (!/^0[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Tên khách hàng hoặc Số điện thoại không đúng định dạng' },
        { status: 400 }
      );
    }

    // UC5.1 5c.1: Số điện thoại đã tồn tại
    const existing = await getCustomerByPhone(cleanPhone);
    if (existing) {
      return NextResponse.json(
        { error: 'Số điện thoại đã tồn tại trong hệ thống' },
        { status: 400 }
      );
    }

    const created = await createCustomer({
      tenKhachHang: tenKhachHang.trim(),
      soDienThoai: cleanPhone,
      diaChi: diaChi ? diaChi.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Thêm khách hàng thành công',
      customer: created,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
