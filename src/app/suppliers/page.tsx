'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<'add' | 'edit'>('add');

  const [activeSupplier, setActiveSupplier] = useState<any>(null);
  const [deleteError, setDeleteError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    tenNhaCungCap: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    danhMuc: '',
    newCategoryName: '',
    moTa: '',
    trangThai: 'Đang hợp tác',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formDirty, setFormDirty] = useState(false);

  const fetchSuppliers = async () => {
    setSearchError('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (category) params.append('category', category);
      if (status) params.append('status', status);

      const res = await fetch(`/api/suppliers?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error || 'Lỗi khi tải nhà cung cấp');
      } else {
        setSuppliers(data.suppliers || []);
        if (data.suppliers?.length === 0) {
          // UC2.4 4a.1: Không tìm thấy nhà cung cấp!
          setSearchError('Không tìm thấy nhà cung cấp!');
        }
      }

      // Fetch categories
      const catRes = await fetch('/api/products');
      const catData = await catRes.json();
      setCategories(catData.categories || []);
    } catch {
      setSearchError('Không thể tải dữ liệu nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuppliers();
  };

  const openAddModal = () => {
    setFormData({
      tenNhaCungCap: '',
      soDienThoai: '',
      email: '',
      diaChi: '',
      danhMuc: categories[0]?.tenDanhMuc || '',
      newCategoryName: '',
      moTa: '',
      trangThai: 'Đang hợp tác',
    });
    setFormErrors({});
    setFormDirty(false);
    setShowAddModal(true);
  };

  const openEditModal = (sup: any) => {
    setActiveSupplier(sup);
    setFormData({
      tenNhaCungCap: sup.tenNhaCungCap,
      soDienThoai: sup.soDienThoai,
      email: sup.email || '',
      diaChi: sup.diaChi || '',
      danhMuc: sup.danhMuc || '',
      newCategoryName: '',
      moTa: sup.moTa || '',
      trangThai: sup.trangThai || 'Đang hợp tác',
    });
    setFormErrors({});
    setFormDirty(false);
    setShowEditModal(true);
  };

  const handleCancelClick = (target: 'add' | 'edit') => {
    if (formDirty) {
      setCancelTarget(target);
      setShowCancelPrompt(true);
    } else {
      if (target === 'add') setShowAddModal(false);
      if (target === 'edit') setShowEditModal(false);
    }
  };

  const confirmCancel = () => {
    setShowCancelPrompt(false);
    if (cancelTarget === 'add') setShowAddModal(false);
    if (cancelTarget === 'edit') setShowEditModal(false);
  };

  // Submit Add (UC2.1)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    // 5a.1: Không được để trống!
    if (!formData.tenNhaCungCap.trim()) errs.tenNhaCungCap = 'Không được để trống!';
    if (!formData.soDienThoai.trim()) errs.soDienThoai = 'Không được để trống!';

    // 5b.1: Dữ liệu không hợp lệ!
    const cleanPhone = formData.soDienThoai.trim();
    if (formData.soDienThoai && !/^[0-9]{10}$/.test(cleanPhone)) {
      errs.soDienThoai = 'Dữ liệu không hợp lệ!';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Dữ liệu không hợp lệ!';
      }
    }

    // 5d.1: Chọn "Khác" nhưng để trống
    if (formData.danhMuc === 'Khác') {
      if (!formData.newCategoryName.trim()) {
        errs.newCategoryName = 'Vui lòng nhập tên danh mục mới!';
      } else {
        // 5c.1: Danh mục mới đã tồn tại
        const dup = categories.find(
          (c) => c.tenDanhMuc.toLowerCase() === formData.newCategoryName.trim().toLowerCase()
        );
        if (dup) {
          errs.newCategoryName = 'Danh mục đã tồn tại, vui lòng chọn danh mục có sẵn!';
        }
      }
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Lỗi thêm nhà cung cấp');
      } else {
        alert('Thêm nhà cung cấp thành công!');
        setShowAddModal(false);
        fetchSuppliers();
      }
    } catch {
      alert('Không thể lưu nhà cung cấp');
    }
  };

  // Submit Edit (UC2.2)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.tenNhaCungCap.trim()) errs.tenNhaCungCap = 'Không được để trống!';
    if (!formData.soDienThoai.trim()) errs.soDienThoai = 'Không được để trống!';

    const cleanPhone = formData.soDienThoai.trim();
    if (formData.soDienThoai && !/^[0-9]{10}$/.test(cleanPhone)) {
      errs.soDienThoai = 'Dữ liệu không hợp lệ!';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Dữ liệu không hợp lệ!';
      }
    }

    if (formData.danhMuc === 'Khác') {
      if (!formData.newCategoryName.trim()) {
        errs.newCategoryName = 'Vui lòng nhập tên danh mục mới!';
      } else {
        const dup = categories.find(
          (c) => c.tenDanhMuc.toLowerCase() === formData.newCategoryName.trim().toLowerCase()
        );
        if (dup) {
          errs.newCategoryName = 'Danh mục đã tồn tại, vui lòng chọn danh mục có sẵn!';
        }
      }
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      const res = await fetch(`/api/suppliers/${activeSupplier.maNhaCungCap}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Lỗi cập nhật nhà cung cấp');
      } else {
        alert('Cập nhật thông tin nhà cung cấp thành công!');
        setShowEditModal(false);
        fetchSuppliers();
      }
    } catch {
      alert('Không thể lưu thông tin nhà cung cấp');
    }
  };

  // Delete Supplier (UC2.3)
  const handleDeleteSupplier = async () => {
    setDeleteError('');
    try {
      const res = await fetch(`/api/suppliers/${activeSupplier.maNhaCungCap}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Không thể xóa nhà cung cấp');
      } else {
        alert('Xóa nhà cung cấp thành công!');
        setShowDeleteModal(false);
        fetchSuppliers();
      }
    } catch {
      setDeleteError('Lỗi kết nối khi xóa nhà cung cấp');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Truck className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Quản lý nhà cung cấp</h2>
              <p className="text-xs text-slate-500">
                Thêm mới, sửa, xóa và tìm kiếm đối tác cung ứng (UC2.1 - 2.4)
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nhà cung cấp</span>
          </button>
        </div>

        {/* Filter bar (UC2.4) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Từ khóa (Mã hoặc Tên nhà cung cấp):
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ví dụ: NCC001, Acecook..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-44">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.maDanhMuc} value={c.tenDanhMuc}>
                    {c.tenDanhMuc}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đang hợp tác">Đang hợp tác</option>
                <option value="Ngừng hợp tác">Ngừng hợp tác</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 h-[38px]"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>

        {searchError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Suppliers Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã NCC</th>
                  <th className="py-3 px-4">Tên nhà cung cấp</th>
                  <th className="py-3 px-4">Số điện thoại</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Không có nhà cung cấp nào.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((s) => (
                    <tr key={s.maNhaCungCap} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {s.maNhaCungCap}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {s.tenNhaCungCap}
                        {s.diaChi && (
                          <span className="block text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            <span>{s.diaChi}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-mono">
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{s.soDienThoai}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {s.email ? (
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{s.email}</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">--</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{s.danhMuc || '--'}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.trangThai === 'Đang hợp tác'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {s.trangThai}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 rounded-lg border border-slate-200 text-blue-700 hover:bg-blue-50"
                            title="Sửa thông tin nhà cung cấp (UC2.2)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setActiveSupplier(s);
                              setDeleteError('');
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50"
                            title="Xóa nhà cung cấp (UC2.3)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Thêm nhà cung cấp (UC2.1) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Thêm nhà cung cấp</h3>
              <button
                onClick={() => handleCancelClick('add')}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã nhà cung cấp:
                </label>
                <input
                  type="text"
                  disabled
                  value="Hệ thống tự động sinh (NCCxxx)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên nhà cung cấp: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenNhaCungCap}
                  onChange={(e) => {
                    setFormData({ ...formData, tenNhaCungCap: e.target.value });
                    setFormDirty(true);
                  }}
                  placeholder="Ví dụ: Công ty Acecook Miền Trung"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
                {formErrors.tenNhaCungCap && (
                  <p className="text-red-600 text-[11px] mt-1">{formErrors.tenNhaCungCap}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.soDienThoai}
                    onChange={(e) => {
                      setFormData({ ...formData, soDienThoai: e.target.value });
                      setFormDirty(true);
                    }}
                    placeholder="10 chữ số (09xxxxxxxx)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.soDienThoai && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.soDienThoai}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email:</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFormDirty(true);
                    }}
                    placeholder="example@domain.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ:</label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => {
                    setFormData({ ...formData, diaChi: e.target.value });
                    setFormDirty(true);
                  }}
                  placeholder="Địa chỉ nhà cung cấp..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              {/* Danh mục & Khác */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Danh mục:</label>
                <select
                  value={formData.danhMuc}
                  onChange={(e) => {
                    setFormData({ ...formData, danhMuc: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.maDanhMuc} value={c.tenDanhMuc}>
                      {c.tenDanhMuc}
                    </option>
                  ))}
                  <option value="Khác">Khác (Nhập danh mục mới)</option>
                </select>

                {formData.danhMuc === 'Khác' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={formData.newCategoryName}
                      onChange={(e) => {
                        setFormData({ ...formData, newCategoryName: e.target.value });
                        setFormDirty(true);
                      }}
                      placeholder="Nhập tên danh mục mới..."
                      className="w-full px-3 py-2 border border-amber-300 bg-amber-50 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    {formErrors.newCategoryName && (
                      <p className="text-red-600 text-[11px] mt-1">
                        {formErrors.newCategoryName}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả:</label>
                <textarea
                  rows={2}
                  value={formData.moTa}
                  onChange={(e) => {
                    setFormData({ ...formData, moTa: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleCancelClick('add')}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Sửa thông tin nhà cung cấp (UC2.2) */}
      {showEditModal && activeSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Sửa thông tin nhà cung cấp</h3>
              <button
                onClick={() => handleCancelClick('edit')}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã nhà cung cấp (Khóa):
                </label>
                <input
                  type="text"
                  disabled
                  value={activeSupplier.maNhaCungCap}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên nhà cung cấp: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenNhaCungCap}
                  onChange={(e) => {
                    setFormData({ ...formData, tenNhaCungCap: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.tenNhaCungCap && (
                  <p className="text-red-600 text-[11px] mt-1">{formErrors.tenNhaCungCap}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.soDienThoai}
                    onChange={(e) => {
                      setFormData({ ...formData, soDienThoai: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.soDienThoai && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.soDienThoai}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email:</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái:
                  </label>
                  <select
                    value={formData.trangThai}
                    onChange={(e) => {
                      setFormData({ ...formData, trangThai: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Đang hợp tác">Đang hợp tác</option>
                    <option value="Ngừng hợp tác">Ngừng hợp tác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Danh mục:
                  </label>
                  <select
                    value={formData.danhMuc}
                    onChange={(e) => {
                      setFormData({ ...formData, danhMuc: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.maDanhMuc} value={c.tenDanhMuc}>
                        {c.tenDanhMuc}
                      </option>
                    ))}
                    <option value="Khác">Khác (Nhập mới)</option>
                  </select>
                </div>
              </div>

              {formData.danhMuc === 'Khác' && (
                <div>
                  <input
                    type="text"
                    value={formData.newCategoryName}
                    onChange={(e) => {
                      setFormData({ ...formData, newCategoryName: e.target.value });
                      setFormDirty(true);
                    }}
                    placeholder="Nhập tên danh mục mới..."
                    className="w-full px-3 py-2 border border-amber-300 bg-amber-50 rounded-xl text-xs"
                  />
                  {formErrors.newCategoryName && (
                    <p className="text-red-600 text-[11px] mt-1">
                      {formErrors.newCategoryName}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ:</label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => {
                    setFormData({ ...formData, diaChi: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả:</label>
                <textarea
                  rows={2}
                  value={formData.moTa}
                  onChange={(e) => {
                    setFormData({ ...formData, moTa: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleCancelClick('edit')}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Xóa nhà cung cấp (UC2.3) */}
      {showDeleteModal && activeSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              {/* UC2.3 Main flow step 2 */}
              <h4 className="text-base font-bold text-slate-800">
                Bạn có chắc chắn muốn xóa nhà cung cấp này?
              </h4>
              <p className="text-xs text-slate-500">
                Nhà cung cấp: <strong>{activeSupplier.tenNhaCungCap}</strong> (
                {activeSupplier.maNhaCungCap})
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleDeleteSupplier}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CANCEL MODAL */}
      {showCancelPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800">
                Bạn có chắc chắn muốn hủy không?
              </h4>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelPrompt(false)}
                className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
