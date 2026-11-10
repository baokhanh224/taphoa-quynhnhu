import { NextRequest, NextResponse } from 'next/server';
import { createExchangeReturn } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const switches = getDemoSwitches(req);
  // UC6.5 10a.1: Không thể lưu phiếu đổi/trả
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu phiếu đổi/trả' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { itemsReturn, itemsExchange, moneyConfirmed, idempotencyKey } = body;

    if (!itemsReturn || !Array.isArray(itemsReturn) || itemsReturn.length === 0) {
      return NextResponse.json({ error: 'Chưa chọn sản phẩm trả' }, { status: 400 });
    }

    // Money confirmation check (UC6.5 9a.2)
    // We can also let createExchangeReturn validate, but if moneyConfirmed is false and there's a difference, return exact error:
    // "Vui lòng xác nhận đã xử lý tiền chênh lệch"
    if (!moneyConfirmed) {
      return NextResponse.json(
        { error: 'Vui lòng xác nhận đã xử lý tiền chênh lệch' },
        { status: 400 }
      );
    }

    const res = await createExchangeReturn({
      maHoaDon: params.id,
      idempotencyKey,
      itemsReturn: itemsReturn.map((r: any) => ({
        maChiTietHoaDon: r.maChiTietHoaDon,
        soLuongTra: Number(r.soLuongTra),
        duocNhapLaiKho: r.duocNhapLaiKho !== false,
      })),
      itemsExchange: (itemsExchange || []).map((e: any) => ({
        maSanPham: e.maSanPham,
        maDonVi: e.maDonVi,
        soLuong: Number(e.soLuong),
      })),
    });

    return NextResponse.json({
      success: true,
      message: 'Xử lý đổi/trả hàng thành công',
      phieu: res.phieu,
    });
  } catch (err: any) {
    if (
      err.message === 'Hóa đơn không thể đổi/trả hàng' ||
      err.message === 'Số lượng trả không hợp lệ' ||
      err.message === 'Không đủ số lượng hàng có thể bán'
    ) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || 'Không thể lưu phiếu đổi/trả' },
      { status: 500 }
    );
  }
}
