import { NextRequest, NextResponse } from 'next/server';
import {
  getCustomers,
  updateCustomer,
  deleteCustomer,
  checkCustomerHasInvoices,
  getCustomerByPhone,
} from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const list = await getCustomers(params.id);
    const customer = list.find((c) => c.maKhachHang === params.id);
    if (!customer) {
      return NextResponse.json({ error: 'Không tìm thấy khách hàng phù hợp' }, { status: 404 });
    }
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const switches = getDemoSwitches(req);
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu thông tin khách hàng' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { tenKhachHang, soDienThoai, diaChi } = body;

    // UC5.2 5a.1
    if (!tenKhachHang || !tenKhachHang.trim() || !soDienThoai || !soDienThoai.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Tên khách hàng và Số điện thoại' },
        { status: 400 }
      );
    }

    // UC5.2 5b.1
    const cleanPhone = soDienThoai.trim();
    if (!/^0[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Tên khách hàng hoặc Số điện thoại không đúng định dạng' },
        { status: 400 }
      );
    }

    // UC5.2 5c.1: Check duplicate phone with other customer
    const existing = await getCustomerByPhone(cleanPhone);
    if (existing && existing.maKhachHang !== params.id) {
      return NextResponse.json(
        { error: 'Số điện thoại đã tồn tại trong hệ thống' },
        { status: 400 }
      );
    }

    const updated = await updateCustomer(params.id, {
      tenKhachHang: tenKhachHang.trim(),
      soDienThoai: cleanPhone,
      diaChi: diaChi ? diaChi.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      customer: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // BR-UC5-05, UC5.3 4a.1: Không được xóa khách hàng đã phát sinh hóa đơn mua hàng
    const hasInvoices = await checkCustomerHasInvoices(params.id);
    if (hasInvoices) {
      return NextResponse.json(
        { error: 'Không thể xóa khách hàng đã có lịch sử mua hàng' },
        { status: 400 }
      );
    }

    await deleteCustomer(params.id);
    return NextResponse.json({
      success: true,
      message: 'Xóa khách hàng thành công',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
