import { NextRequest, NextResponse } from 'next/server';
import { createImportTicket, getImportHistory, getProductById } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC4.4 5b.1: Không thể tải lịch sử nhập hàng
  if (switches.errorLoad) {
    return NextResponse.json({ error: 'Không thể tải lịch sử nhập hàng' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || undefined;
  const fromDate = searchParams.get('fromDate') || undefined;
  const toDate = searchParams.get('toDate') || undefined;

  // BR-UC4-13: Từ ngày không được lớn hơn Đến ngày
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    return NextResponse.json({ error: 'Khoảng thời gian không hợp lệ' }, { status: 400 });
  }

  try {
    const list = await getImportHistory(keyword, fromDate, toDate);
    return NextResponse.json({ importTickets: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC4.1 8a.1: Không thể lưu phiếu nhập
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu phiếu nhập' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { maNhaCungCap, items } = body;

    // BR-UC4-01: Phiếu nhập phải có nhà cung cấp và ít nhất một sản phẩm
    if (!maNhaCungCap || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Không được để trống' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const it of items) {
      // 5a.2: Bỏ trống thông tin bắt buộc
      if (!it.maSanPham || !it.maDonViNhap || it.soLuongNhap === undefined || it.giaNhap === undefined) {
        return NextResponse.json({ error: 'Không được để trống' }, { status: 400 });
      }

      // 5b.2: Số lượng nhập và giá nhập phải lớn hơn 0
      const qty = Number(it.soLuongNhap);
      const price = Number(it.giaNhap);
      if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
        return NextResponse.json(
          { error: 'Số lượng nhập và giá nhập phải lớn hơn 0' },
          { status: 400 }
        );
      }

      // Check product requirement for expiry date
      const prod = await getProductById(it.maSanPham);
      if (prod && prod.quanLyHanSuDung) {
        if (!it.hanSuDung) {
          return NextResponse.json({ error: 'Không được để trống' }, { status: 400 });
        }
        const expDate = new Date(it.hanSuDung);
        expDate.setHours(0, 0, 0, 0);
        // UC4.1 5c.2 (7c.1): Hạn sử dụng phải sau ngày nhập hàng
        if (expDate <= today) {
          return NextResponse.json(
            { error: 'Hạn sử dụng phải sau ngày nhập hàng' },
            { status: 400 }
          );
        }
      }
    }

    const ticket = await createImportTicket({
      maNhaCungCap,
      items: items.map((it) => ({
        maSanPham: it.maSanPham,
        maDonViNhap: it.maDonViNhap,
        soLuongNhap: Number(it.soLuongNhap),
        giaNhap: Number(it.giaNhap),
        hanSuDung: it.hanSuDung || null,
      })),
    });

    return NextResponse.json({
      success: true,
      message: 'Nhập hàng thành công',
      ticket,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi khi nhập hàng' }, { status: 500 });
  }
}
