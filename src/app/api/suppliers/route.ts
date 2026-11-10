import { NextRequest, NextResponse } from 'next/server';
import { getSuppliers, createSupplier, getCategories, createCategory } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  if (switches.errorLoad) {
    return NextResponse.json({ error: 'Không thể tải danh sách nhà cung cấp' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || undefined;
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;

  try {
    const suppliers = await getSuppliers(keyword, category, status);
    return NextResponse.json({ suppliers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const switches = getDemoSwitches(req);
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu nhà cung cấp' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { tenNhaCungCap, soDienThoai, email, diaChi, danhMuc, newCategoryName, moTa } = body;

    // BR-UC2-03, BR-UC2-04
    if (!tenNhaCungCap || !tenNhaCungCap.trim()) {
      return NextResponse.json({ error: 'Không được để trống!' }, { status: 400 });
    }
    if (!soDienThoai || !soDienThoai.trim()) {
      return NextResponse.json({ error: 'Không được để trống!' }, { status: 400 });
    }

    const cleanPhone = soDienThoai.trim();
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ!' }, { status: 400 });
    }

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ error: 'Dữ liệu không hợp lệ!' }, { status: 400 });
      }
    }

    let finalDanhMuc = danhMuc;
    // Alternative flow 3a: Khác -> nhập tên danh mục mới
    if (danhMuc === 'Khác' || newCategoryName) {
      if (!newCategoryName || !newCategoryName.trim()) {
        return NextResponse.json({ error: 'Vui lòng nhập tên danh mục mới!' }, { status: 400 });
      }
      const existingCategories = await getCategories();
      const dup = existingCategories.find(
        (c) => c.tenDanhMuc.toLowerCase() === newCategoryName.trim().toLowerCase()
      );
      if (dup) {
        return NextResponse.json(
          { error: 'Danh mục đã tồn tại, vui lòng chọn danh mục có sẵn!' },
          { status: 400 }
        );
      }
      const newCat = await createCategory(newCategoryName.trim());
      finalDanhMuc = newCat.tenDanhMuc;
    }

    const created = await createSupplier({
      tenNhaCungCap: tenNhaCungCap.trim(),
      soDienThoai: cleanPhone,
      email: email ? email.trim() : undefined,
      diaChi: diaChi ? diaChi.trim() : undefined,
      danhMuc: finalDanhMuc || undefined,
      moTa: moTa ? moTa.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Thêm nhà cung cấp thành công!',
      supplier: created,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
