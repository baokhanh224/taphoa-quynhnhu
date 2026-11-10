import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProductPrice } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const switches = getDemoSwitches(req);
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể cập nhật giá bán' }, { status: 500 });
  }

  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại!' }, { status: 404 });
    }

    const body = await req.json();
    const { maDonVi, giaBanMoi, confirmedLower } = body;

    // BR-UC1-09: Giá bán mới không được để trống và phải là số lớn hơn 0
    if (giaBanMoi === undefined || giaBanMoi === null || giaBanMoi === '') {
      return NextResponse.json({ error: 'Không được để trống!' }, { status: 400 });
    }

    const numGiaBanMoi = Number(giaBanMoi);
    if (isNaN(numGiaBanMoi) || numGiaBanMoi <= 0) {
      return NextResponse.json({ error: 'Giá bán không hợp lệ!' }, { status: 400 });
    }

    // Alternative flow 5c: Cảnh báo giá bán thấp hơn giá nhập
    const giaNhap = Number(product.giaNhapBinhQuan);
    if (numGiaBanMoi < giaNhap && !confirmedLower) {
      return NextResponse.json(
        {
          warning: true,
          message: 'Giá bán thấp hơn giá nhập. Bạn có muốn tiếp tục?',
        },
        { status: 200 }
      );
    }

    const targetUnit = maDonVi || product.donViQuyDois[0]?.maDonVi;
    if (!targetUnit) {
      return NextResponse.json({ error: 'Đơn vị bán không hợp lệ!' }, { status: 400 });
    }

    const result = await updateProductPrice(targetUnit, numGiaBanMoi);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Lỗi cập nhật giá bán' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật giá bán thành công!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
