'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  AlertTriangle,
  X,
  History,
  CheckCircle2,
} from 'lucide-react';
import { formatVND, formatDateTime } from '@/lib/formatters';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelTargetModal, setCancelTargetModal] = useState<string>('');

  // Active product
  const [activeProduct, setActiveProduct] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    tenSanPham: '',
    maDanhMuc: '',
    donViTinh: '',
    giaNhap: '',
    giaBan: '',
    maVach: '',
    mucTonToiThieu: '0',
    quanLyHanSuDung: false,
    moTa: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formDirty, setFormDirty] = useState(false);

  // Price update states (UC1.5)
  const [giaBanMoi, setGiaBanMoi] = useState('');
  const [priceWarningModal, setPriceWarningModal] = useState(false);
  const [priceError, setPriceError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchProducts = async () => {
    setSearchError('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (selectedCat) params.append('categoryId', selectedCat);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error || 'Lỗi khi tải danh sách sản phẩm');
      } else {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        if (data.products?.length === 0) {
          // UC1.4 4a.1: Không tìm thấy sản phẩm!
          setSearchError('Không tìm thấy sản phẩm!');
        }
      }
    } catch {
      setSearchError('Không thể tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      tenSanPham: '',
      maDanhMuc: categories[0]?.maDanhMuc || '',
      donViTinh: '',
      giaNhap: '',
      giaBan: '',
      maVach: '',
      mucTonToiThieu: '5',
      quanLyHanSuDung: false,
      moTa: '',
    });
    setFormErrors({});
    setFormDirty(false);
    setShowAddModal(true);
  };

  // Open Edit Modal (UC1.2)
  const openEditModal = (prod: any) => {
    setActiveProduct(prod);
    setFormData({
      tenSanPham: prod.tenSanPham,
      maDanhMuc: prod.maDanhMuc,
      donViTinh: prod.donViTinh,
      giaNhap: String(prod.giaNhapBinhQuan),
      giaBan: String(prod.donViQuyDois?.[0]?.giaBan || 0),
      maVach: prod.maVach || '',
      mucTonToiThieu: String(prod.mucTonToiThieu || 0),
      quanLyHanSuDung: Boolean(prod.quanLyHanSuDung),
      moTa: prod.moTa || '',
    });
    setFormErrors({});
    setFormDirty(false);
    setShowEditModal(true);
  };

  // Open Price Update Modal (UC1.5)
  const openPriceModal = (prod: any) => {
    setActiveProduct(prod);
    setGiaBanMoi('');
    setPriceError('');
    setPriceWarningModal(false);
    setShowPriceModal(true);
  };

  // Handle Cancel in Forms (UC1.1 4a, UC1.2 4a, UC1.5 4a)
  const handleFormCancel = (modalType: 'add' | 'edit' | 'price') => {
    if (modalType === 'price') {
      if (giaBanMoi.trim() !== '') {
        // UC1.5 4a.2: Bạn có chắc chắn muốn hủy cập nhật giá bán không?
        setCancelTargetModal('price');
        setShowCancelPrompt(true);
      } else {
        setShowPriceModal(false);
      }
      return;
    }

    if (formDirty) {
      // UC1.2 4a.2: Bạn có chắc chắn muốn hủy không?
      setCancelTargetModal(modalType);
      setShowCancelPrompt(true);
    } else {
      if (modalType === 'add') setShowAddModal(false);
      if (modalType === 'edit') setShowEditModal(false);
    }
  };

  const confirmCancel = () => {
    setShowCancelPrompt(false);
    if (cancelTargetModal === 'add') setShowAddModal(false);
    if (cancelTargetModal === 'edit') setShowEditModal(false);
    if (cancelTargetModal === 'price') setShowPriceModal(false);
  };

  // Submit Add Product (UC1.1)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    // 5a.1: Không được để trống!
    if (!formData.tenSanPham.trim()) errs.tenSanPham = 'Không được để trống!';
    if (!formData.maDanhMuc) errs.maDanhMuc = 'Không được để trống!';
    if (!formData.donViTinh.trim()) errs.donViTinh = 'Không được để trống!';
    if (!formData.giaNhap) errs.giaNhap = 'Không được để trống!';
    if (!formData.giaBan) errs.giaBan = 'Không được để trống!';

    // 5b.1: Dữ liệu không hợp lệ!
    const numNhap = Number(formData.giaNhap);
    const numBan = Number(formData.giaBan);
    if (formData.giaNhap && (isNaN(numNhap) || numNhap <= 0)) {
      errs.giaNhap = 'Dữ liệu không hợp lệ!';
    }
    if (formData.giaBan && (isNaN(numBan) || numBan <= 0)) {
      errs.giaBan = 'Dữ liệu không hợp lệ!';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenSanPham: formData.tenSanPham.trim(),
          maDanhMuc: formData.maDanhMuc,
          donViTinh: formData.donViTinh.trim(),
          giaNhap: numNhap,
          giaBan: numBan,
          maVach: formData.maVach.trim() || undefined,
          mucTonToiThieu: Number(formData.mucTonToiThieu) || 0,
          quanLyHanSuDung: formData.quanLyHanSuDung,
          moTa: formData.moTa.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Lỗi thêm sản phẩm');
      } else {
        alert('Thêm sản phẩm thành công!');
        setShowAddModal(false);
        fetchProducts();
      }
    } catch {
      alert('Không thể lưu sản phẩm');
    }
  };

  // Submit Edit Product (UC1.2)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.tenSanPham.trim()) errs.tenSanPham = 'Không được để trống!';
    if (!formData.maDanhMuc) errs.maDanhMuc = 'Không được để trống!';
    if (!formData.donViTinh.trim()) errs.donViTinh = 'Không được để trống!';
    if (!formData.giaNhap) errs.giaNhap = 'Không được để trống!';

    const numNhap = Number(formData.giaNhap);
    if (formData.giaNhap && (isNaN(numNhap) || numNhap <= 0)) {
      errs.giaNhap = 'Dữ liệu không hợp lệ!';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      const res = await fetch(`/api/products/${activeProduct.maSanPham}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenSanPham: formData.tenSanPham.trim(),
          maDanhMuc: formData.maDanhMuc,
          donViTinh: formData.donViTinh.trim(),
          giaNhap: numNhap,
          maVach: formData.maVach.trim() || undefined,
          mucTonToiThieu: Number(formData.mucTonToiThieu) || 0,
          quanLyHanSuDung: formData.quanLyHanSuDung,
          moTa: formData.moTa.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Lỗi cập nhật sản phẩm');
      } else {
        alert('Cập nhật sản phẩm thành công!');
        setShowEditModal(false);
        fetchProducts();
      }
    } catch {
      alert('Không thể lưu sản phẩm');
    }
  };

  // Delete Product (UC1.3)
  const handleDeleteProduct = async () => {
    setDeleteError('');
    try {
      const res = await fetch(`/api/products/${activeProduct.maSanPham}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Không thể xóa sản phẩm!');
      } else {
        alert('Xóa sản phẩm thành công!');
        setShowDeleteModal(false);
        fetchProducts();
      }
    } catch {
      setDeleteError('Lỗi kết nối khi xóa sản phẩm');
    }
  };

  // Submit Price Update (UC1.5)
  const handlePriceSubmit = async (confirmedLower = false) => {
    setPriceError('');

    // 5a.1: Bỏ trống trường “Giá bán mới”
    if (!giaBanMoi.trim()) {
      setPriceError('Không được để trống!');
      return;
    }

    // 5b.1: Giá bán mới không phải số lớn hơn 0
    const numPrice = Number(giaBanMoi);
    if (isNaN(numPrice) || numPrice <= 0) {
      setPriceError('Giá bán không hợp lệ!');
      return;
    }

    // 5c.1: Giá bán thấp hơn giá nhập -> hiển thị cảnh báo
    const giaNhap = Number(activeProduct?.giaNhapBinhQuan || 0);
    if (numPrice < giaNhap && !confirmedLower) {
      setPriceWarningModal(true);
      return;
    }

    try {
      const defaultUnit = activeProduct?.donViQuyDois?.[0];
      const res = await fetch(`/api/products/${activeProduct.maSanPham}/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maDonVi: defaultUnit?.maDonVi,
          giaBanMoi: numPrice,
          confirmedLower: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPriceError(data.error || 'Cập nhật giá bán thất bại');
      } else {
        alert('Cập nhật giá bán thành công!');
        setShowPriceModal(false);
        setPriceWarningModal(false);
        fetchProducts();
      }
    } catch {
      setPriceError('Không thể cập nhật giá bán');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Package className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Quản lý sản phẩm</h2>
              <p className="text-xs text-slate-500">
                Thêm mới, sửa, xóa, tra cứu sản phẩm và cập nhật giá bán (UC1.1 - 1.5)
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Filter bar (UC1.4) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Từ khóa (Mã sản phẩm hoặc Tên sản phẩm):
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Nhập mã hoặc tên sản phẩm..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-48">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục:</label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.maDanhMuc} value={c.maDanhMuc}>
                    {c.tenDanhMuc}
                  </option>
                ))}
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

        {/* Product Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã SP</th>
                  <th className="py-3 px-4">Tên sản phẩm</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4 text-center">ĐVT</th>
                  <th className="py-3 px-4 text-right">Giá nhập</th>
                  <th className="py-3 px-4 text-right">Giá bán</th>
                  <th className="py-3 px-4 text-center">Tồn kho</th>
                  <th className="py-3 px-4 text-center">Hạn SD</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const defaultUnit = p.donViQuyDois?.[0];
                    const isLowStock = p.soLuongTon <= p.mucTonToiThieu;

                    return (
                      <tr key={p.maSanPham} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {p.maSanPham}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {p.tenSanPham}
                          {p.maVach && (
                            <span className="block text-[10px] text-slate-400 font-mono">
                              Mã vạch: {p.maVach}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {p.danhMuc?.tenDanhMuc || ''}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-slate-600">
                          {p.donViTinh}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          {formatVND(p.giaNhapBinhQuan)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700">
                          {defaultUnit ? formatVND(defaultUnit.giaBan) : '0 đ'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.soLuongTon <= 0
                                ? 'bg-red-100 text-red-700'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.soLuongTon} {p.donViTinh}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {p.quanLyHanSuDung ? (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                              Có QL hạn
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Không</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Cập nhật giá bán (UC1.5) */}
                            <button
                              onClick={() => openPriceModal(p)}
                              className="p-1.5 rounded-lg border border-slate-200 text-amber-700 hover:bg-amber-50"
                              title="Cập nhật giá bán (UC1.5)"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>

                            {/* Sửa (UC1.2) */}
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg border border-slate-200 text-blue-700 hover:bg-blue-50"
                              title="Sửa sản phẩm (UC1.2)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Xóa (UC1.3) */}
                            <button
                              onClick={() => {
                                setActiveProduct(p);
                                setDeleteError('');
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50"
                              title="Xóa sản phẩm (UC1.3)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Thêm sản phẩm (UC1.1) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Thêm sản phẩm mới</h3>
              <button
                onClick={() => handleFormCancel('add')}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã sản phẩm:
                </label>
                <input
                  type="text"
                  disabled
                  value="Hệ thống tự động sinh (SPxxxx)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên sản phẩm: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenSanPham}
                  onChange={(e) => {
                    setFormData({ ...formData, tenSanPham: e.target.value });
                    setFormDirty(true);
                  }}
                  placeholder="Ví dụ: Mì Hảo Hảo Tôm Chua Cay 75g"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {formErrors.tenSanPham && (
                  <p className="text-red-600 text-[11px] mt-1">{formErrors.tenSanPham}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Danh mục: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.maDanhMuc}
                    onChange={(e) => {
                      setFormData({ ...formData, maDanhMuc: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.maDanhMuc} value={c.maDanhMuc}>
                        {c.tenDanhMuc}
                      </option>
                    ))}
                  </select>
                  {formErrors.maDanhMuc && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.maDanhMuc}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đơn vị tính cơ sở: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.donViTinh}
                    onChange={(e) => {
                      setFormData({ ...formData, donViTinh: e.target.value });
                      setFormDirty(true);
                    }}
                    placeholder="Gói, Lon, Hộp, Chai..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.donViTinh && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.donViTinh}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá nhập (VNĐ): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.giaNhap}
                    onChange={(e) => {
                      setFormData({ ...formData, giaNhap: e.target.value });
                      setFormDirty(true);
                    }}
                    placeholder="Ví dụ: 3800"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.giaNhap && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.giaNhap}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá bán (VNĐ): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.giaBan}
                    onChange={(e) => {
                      setFormData({ ...formData, giaBan: e.target.value });
                      setFormDirty(true);
                    }}
                    placeholder="Ví dụ: 4500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.giaBan && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.giaBan}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã vạch (Tùy chọn):
                  </label>
                  <input
                    type="text"
                    value={formData.maVach}
                    onChange={(e) => {
                      setFormData({ ...formData, maVach: e.target.value });
                      setFormDirty(true);
                    }}
                    placeholder="Nhập mã vạch barcode..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mức tồn tối thiểu:
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.mucTonToiThieu}
                    onChange={(e) => {
                      setFormData({ ...formData, mucTonToiThieu: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.quanLyHanSuDung}
                    onChange={(e) => {
                      setFormData({ ...formData, quanLyHanSuDung: e.target.checked });
                      setFormDirty(true);
                    }}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Có quản lý hạn sử dụng (Hạn thực tế nhập theo từng phiếu nhập kho)</span>
                </label>
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
                  onClick={() => handleFormCancel('add')}
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

      {/* MODAL: Sửa sản phẩm (UC1.2) */}
      {showEditModal && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Sửa thông tin sản phẩm</h3>
              <button
                onClick={() => handleFormCancel('edit')}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã sản phẩm (Khóa):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeProduct.maSanPham}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá bán (Khóa - Dùng Cập nhật giá):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formatVND(formData.giaBan)}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên sản phẩm: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenSanPham}
                  onChange={(e) => {
                    setFormData({ ...formData, tenSanPham: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.tenSanPham && (
                  <p className="text-red-600 text-[11px] mt-1">{formErrors.tenSanPham}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Danh mục: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.maDanhMuc}
                    onChange={(e) => {
                      setFormData({ ...formData, maDanhMuc: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.maDanhMuc} value={c.maDanhMuc}>
                        {c.tenDanhMuc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đơn vị tính cơ sở: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.donViTinh}
                    onChange={(e) => {
                      setFormData({ ...formData, donViTinh: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá nhập (VNĐ): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.giaNhap}
                    onChange={(e) => {
                      setFormData({ ...formData, giaNhap: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  {formErrors.giaNhap && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.giaNhap}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mức tồn tối thiểu:
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.mucTonToiThieu}
                    onChange={(e) => {
                      setFormData({ ...formData, mucTonToiThieu: e.target.value });
                      setFormDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã vạch:</label>
                <input
                  type="text"
                  value={formData.maVach}
                  onChange={(e) => {
                    setFormData({ ...formData, maVach: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.quanLyHanSuDung}
                    onChange={(e) => {
                      setFormData({ ...formData, quanLyHanSuDung: e.target.checked });
                      setFormDirty(true);
                    }}
                    className="rounded text-blue-600"
                  />
                  <span>Có quản lý hạn sử dụng</span>
                </label>
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
                  onClick={() => handleFormCancel('edit')}
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

      {/* MODAL: Xóa sản phẩm (UC1.3) */}
      {showDeleteModal && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              {/* UC1.3 Main flow step 2 */}
              <h4 className="text-base font-bold text-slate-800">
                Bạn có chắc chắn muốn xóa sản phẩm này?
              </h4>
              <p className="text-xs text-slate-500">
                Sản phẩm: <strong>{activeProduct.tenSanPham}</strong> ({activeProduct.maSanPham})
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
                onClick={handleDeleteProduct}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cập nhật giá bán (UC1.5) */}
      {showPriceModal && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-800">Cập nhật giá bán</h3>
              <button
                onClick={() => handleFormCancel('price')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p className="font-bold text-slate-800">{activeProduct.tenSanPham}</p>
              <div className="flex justify-between text-slate-600">
                <span>Giá nhập hiện tại:</span>
                <span className="font-bold">{formatVND(activeProduct.giaNhapBinhQuan)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Giá bán hiện tại:</span>
                <span className="font-bold text-emerald-700">
                  {formatVND(activeProduct.donViQuyDois?.[0]?.giaBan)}
                </span>
              </div>
            </div>

            {priceError && (
              <p className="text-red-600 text-xs font-medium">{priceError}</p>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giá bán mới (VNĐ): <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={giaBanMoi}
                onChange={(e) => setGiaBanMoi(e.target.value)}
                placeholder="Nhập giá bán mới..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleFormCancel('price')}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handlePriceSubmit(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WARNING MODAL: Giá bán thấp hơn giá nhập (UC1.5 5c.1) */}
      {priceWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Giá bán thấp hơn giá nhập. Bạn có muốn tiếp tục?
              </h4>
              <p className="text-xs text-slate-500">
                Giá bán mới: {formatVND(giaBanMoi)} &lt; Giá nhập:{' '}
                {formatVND(activeProduct?.giaNhapBinhQuan)}
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setPriceWarningModal(false)}
                className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => handlePriceSubmit(true)}
                className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL: Xác nhận hủy form khi dữ liệu đã thay đổi (UC1.2 4a.2, UC1.5 4a.2) */}
      {showCancelPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800">
                {cancelTargetModal === 'price'
                  ? 'Bạn có chắc chắn muốn hủy cập nhật giá bán không?'
                  : 'Bạn có chắc chắn muốn hủy không?'}
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
