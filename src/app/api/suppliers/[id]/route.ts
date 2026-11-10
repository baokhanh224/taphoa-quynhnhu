import { NextRequest, NextResponse } from 'next/server';
import {
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  checkSupplierHasImports,
  getCategories,
  createCategory,
} from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supplier = await getSupplierById(params.id);
    if (!supplier) {
      return NextResponse.json({ error: 'Nhà cung cấp không tồn tại!' }, { status: 404 });
    }
    return NextResponse.json({ supplier });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const switches = getDemoSwitches(req);
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể lưu thông tin nhà cung cấp' }, { status: 500 });
  }

  try {
    const existing = await getSupplierById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Nhà cung cấp không tồn tại!' }, { status: 404 });
    }

    const body = await req.json();
    const { tenNhaCungCap, soDienThoai, email, diaChi, danhMuc, newCategoryName, moTa, trangThai } = body;

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

    const updated = await updateSupplier(params.id, {
      tenNhaCungCap: tenNhaCungCap.trim(),
      soDienThoai: cleanPhone,
      email: email ? email.trim() : undefined,
      diaChi: diaChi ? diaChi.trim() : undefined,
      danhMuc: finalDanhMuc || undefined,
      moTa: moTa ? moTa.trim() : undefined,
      trangThai: trangThai || 'Đang hợp tác',
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin nhà cung cấp thành công!',
      supplier: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existing = await getSupplierById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Nhà cung cấp không tồn tại!' }, { status: 404 });
    }

    // BR-UC2-05: Nhà cung cấp đã phát sinh giao dịch nhập hàng thì không được xóa
    const hasImports = await checkSupplierHasImports(params.id);
    if (hasImports) {
      return NextResponse.json(
        { error: 'Không thể xóa nhà cung cấp đã phát sinh giao dịch nhập hàng!' },
        { status: 400 }
      );
    }

    await deleteSupplier(params.id);
    return NextResponse.json({
      success: true,
      message: 'Xóa nhà cung cấp thành công!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
