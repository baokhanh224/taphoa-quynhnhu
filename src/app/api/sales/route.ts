import { NextRequest, NextResponse } from 'next/server';
import { createSaleTransaction, getSalesHistory } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC6.4 5b.1: Không thể tải lịch sử bán hàng
  if (switches.errorLoad) {
    return NextResponse.json({ error: 'Không thể tải lịch sử bán hàng' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || undefined;
  const fromDate = searchParams.get('fromDate') || undefined;
  const toDate = searchParams.get('toDate') || undefined;

  // UC6.4 4a.1: Khoảng thời gian không hợp lệ
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    return NextResponse.json({ error: 'Khoảng thời gian không hợp lệ' }, { status: 400 });
  }

  try {
    const list = await getSalesHistory(keyword, fromDate, toDate);
    return NextResponse.json({ invoices: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC6.1 10a.1: Không thể lưu giao dịch. Hãy thử lại
  if (switches.errorSave) {
    return NextResponse.json(
      { error: 'Không thể lưu giao dịch. Hãy thử lại' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const {
      maKhachHang,
      phuongThucThanhToan,
      tienKhachDua,
      tienThua,
      items,
      idempotencyKey,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 });
    }

    let tongTien = 0;
    for (const it of items) {
      // UC6.1 6a.1: Số lượng bán không hợp lệ
      const qty = Number(it.soLuong);
      if (isNaN(qty) || qty <= 0) {
        return NextResponse.json({ error: 'Số lượng bán không hợp lệ' }, { status: 400 });
      }
      tongTien += Number(it.thanhTien || it.donGia * qty);
    }

    if (phuongThucThanhToan === 'Tiền mặt') {
      const dua = Number(tienKhachDua || 0);
      // UC6.1 8a.2a.2: Tiền khách đưa chưa đủ để thanh toán
      if (dua < tongTien) {
        return NextResponse.json(
          { error: 'Tiền khách đưa chưa đủ để thanh toán' },
          { status: 400 }
        );
      }
    }

    const result = await createSaleTransaction({
      maKhachHang: maKhachHang || null,
      phuongThucThanhToan: phuongThucThanhToan || 'Tiền mặt',
      tienKhachDua: tienKhachDua !== undefined ? Number(tienKhachDua) : undefined,
      tienThua: tienThua !== undefined ? Number(tienThua) : undefined,
      idempotencyKey,
      items: items.map((it: any) => ({
        maSanPham: it.maSanPham,
        maDonViBan: it.maDonViBan,
        soLuong: Number(it.soLuong),
        donGia: Number(it.donGia),
        thanhTien: Number(it.thanhTien || it.donGia * it.soLuong),
      })),
    });

    return NextResponse.json({
      success: true,
      message: 'Bán hàng thành công',
      invoice: result.invoice,
      warningLowStockProducts: result.warningLowStockProducts,
    });
  } catch (err: any) {
    if (err.message === 'Không đủ số lượng hàng có thể bán') {
      return NextResponse.json({ error: 'Không đủ số lượng hàng có thể bán' }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || 'Không thể lưu giao dịch. Hãy thử lại' },
      { status: 500 }
    );
  }
}
