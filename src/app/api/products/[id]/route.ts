import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct, checkProductCanBeDeleted } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại!' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const switches = getDemoSwitches(req);
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu sản phẩm' }, { status: 500 });
  }

  try {
    const existing = await getProductById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại!' }, { status: 404 });
    }

    const body = await req.json();
    const {
      tenSanPham,
      maDanhMuc,
      donViTinh,
      giaNhap,
      maVach,
      mucTonToiThieu,
      quanLyHanSuDung,
      moTa,
      trangThai,
    } = body;

    // BR-UC1-01: Bắt buộc
    if (!tenSanPham || !maDanhMuc || !donViTinh || giaNhap === undefined) {
      return NextResponse.json({ error: 'Không được để trống!' }, { status: 400 });
    }

    const numGiaNhap = Number(giaNhap);
    if (isNaN(numGiaNhap) || numGiaNhap <= 0) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ!' }, { status: 400 });
    }

    const updated = await updateProduct(params.id, {
      tenSanPham: tenSanPham.trim(),
      maDanhMuc,
      donViTinh: donViTinh.trim(),
      giaNhap: numGiaNhap,
      maVach: maVach ? maVach.trim() : undefined,
      mucTonToiThieu: mucTonToiThieu !== undefined ? Number(mucTonToiThieu) : undefined,
      quanLyHanSuDung: quanLyHanSuDung !== undefined ? Boolean(quanLyHanSuDung) : undefined,
      moTa: moTa !== undefined ? moTa.trim() : undefined,
      trangThai,
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      product: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existing = await getProductById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại!' }, { status: 404 });
    }

    // BR-UC1-07: Sản phẩm còn tồn kho hoặc đã phát sinh giao dịch thì không được xóa
    const canDelete = await checkProductCanBeDeleted(params.id);
    if (!canDelete) {
      return NextResponse.json(
        { error: 'Không thể xóa sản phẩm đã có tồn kho hoặc giao dịch!' },
        { status: 400 }
      );
    }

    await deleteProduct(params.id);
    return NextResponse.json({
      success: true,
      message: 'Xóa sản phẩm thành công!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
