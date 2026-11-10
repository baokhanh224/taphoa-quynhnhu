import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, getCategories } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  if (switches.errorLoad) {
    return NextResponse.json({ error: 'Không thể tải dữ liệu sản phẩm' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;

  try {
    const products = await getProducts(keyword, categoryId);
    const categories = await getCategories();
    return NextResponse.json({ products, categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const switches = getDemoSwitches(req);
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu sản phẩm' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      tenSanPham,
      maDanhMuc,
      donViTinh,
      giaNhap,
      giaBan,
      maVach,
      mucTonToiThieu,
      quanLyHanSuDung,
      moTa,
      extraUnits,
    } = body;

    // BR-UC1-01: Bắt buộc
    if (!tenSanPham || !maDanhMuc || !donViTinh || giaNhap === undefined || giaBan === undefined) {
      return NextResponse.json({ error: 'Không được để trống!' }, { status: 400 });
    }

    // BR-UC1-03: Số lớn hơn 0
    const numGiaNhap = Number(giaNhap);
    const numGiaBan = Number(giaBan);
    if (isNaN(numGiaNhap) || numGiaNhap <= 0 || isNaN(numGiaBan) || numGiaBan <= 0) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ!' }, { status: 400 });
    }

    const created = await createProduct({
      tenSanPham: tenSanPham.trim(),
      maDanhMuc,
      donViTinh: donViTinh.trim(),
      giaNhap: numGiaNhap,
      giaBan: numGiaBan,
      maVach: maVach ? maVach.trim() : undefined,
      mucTonToiThieu: mucTonToiThieu ? Number(mucTonToiThieu) : 0,
      quanLyHanSuDung: Boolean(quanLyHanSuDung),
      moTa: moTa ? moTa.trim() : undefined,
      extraUnits,
    });

    return NextResponse.json({
      success: true,
      message: 'Thêm sản phẩm thành công!',
      product: created,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi thêm sản phẩm' }, { status: 500 });
  }
}
