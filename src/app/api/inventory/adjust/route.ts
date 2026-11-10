import { NextRequest, NextResponse } from 'next/server';
import { adjustInventory, getProductById } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function POST(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC4.2 8a.1: Không thể lưu phiếu điều chỉnh
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu phiếu điều chỉnh' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { maSanPham, maChiTietNhap, soLuongMoi, lyDo } = body;

    // UC4.2 7a.1: Thiếu thông tin bắt buộc
    if (!maSanPham || !maChiTietNhap || soLuongMoi === undefined || soLuongMoi === null || !lyDo || !lyDo.trim()) {
      return NextResponse.json({ error: 'Không được để trống' }, { status: 400 });
    }

    // UC4.2 7b.2: Số lượng điều chỉnh không hợp lệ
    const numSoLuongMoi = Number(soLuongMoi);
    if (isNaN(numSoLuongMoi) || !Number.isInteger(numSoLuongMoi) || numSoLuongMoi < 0) {
      return NextResponse.json({ error: 'Số lượng điều chỉnh không hợp lệ' }, { status: 400 });
    }

    // Section 4 decision: Số lượng thực tế không vượt số lượng đã nhập của chi tiết đó
    const prod = await getProductById(maSanPham);
    const lot = prod?.chiTietNhaps.find((c: any) => c.maChiTietNhap === maChiTietNhap);
    if (!lot) {
      return NextResponse.json({ error: 'Chi tiết phiếu nhập không tồn tại' }, { status: 400 });
    }
    const maxImportedBase = lot.soLuongNhap * lot.tyLeQuyDoi;
    if (numSoLuongMoi > maxImportedBase) {
      return NextResponse.json({ error: 'Số lượng điều chỉnh không hợp lệ' }, { status: 400 });
    }

    const adj = await adjustInventory({
      maSanPham,
      maChiTietNhap,
      soLuongMoi: numSoLuongMoi,
      lyDo: lyDo.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Điều chỉnh tồn kho thành công',
      adjustment: adj,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
