'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  X,
  Phone,
  MapPin,
  Receipt,
} from 'lucide-react';
import { formatVND, formatDateTime } from '@/lib/formatters';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<'add' | 'edit'>('add');

  const [activeCustomer, setActiveCustomer] = useState<any>(null);
  const [deleteError, setDeleteError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    tenKhachHang: '',
    soDienThoai: '',
    diaChi: '',
  });

  const [formError, setFormError] = useState('');
  const [formDirty, setFormDirty] = useState(false);

  const fetchCustomers = async () => {
    setSearchError('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());

      const res = await fetch(`/api/customers?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error || 'Lỗi khi tải khách hàng');
      } else {
        setCustomers(data.customers || []);
        if (data.customers?.length === 0) {
          // UC5.4 4a.1: Không tìm thấy khách hàng phù hợp
          setSearchError('Không tìm thấy khách hàng phù hợp');
        }
      }
    } catch {
      setSearchError('Không thể tải dữ liệu khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const openAddModal = () => {
    setFormData({ tenKhachHang: '', soDienThoai: '', diaChi: '' });
    setFormError('');
    setFormDirty(false);
    setShowAddModal(true);
  };

  const openEditModal = (cust: any) => {
    setActiveCustomer(cust);
    setFormData({
      tenKhachHang: cust.tenKhachHang,
      soDienThoai: cust.soDienThoai,
      diaChi: cust.diaChi || '',
    });
    setFormError('');
    setFormDirty(false);
    setShowEditModal(true);
  };

  const openDetailModal = (cust: any) => {
    setActiveCustomer(cust);
    setShowDetailModal(true);
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

  // Submit Add (UC5.1)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Lỗi khi thêm khách hàng');
      } else {
        alert('Thêm khách hàng thành công');
        setShowAddModal(false);
        fetchCustomers();
      }
    } catch {
      setFormError('Không thể lưu thông tin khách hàng');
    }
  };

  // Submit Edit (UC5.2)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      const res = await fetch(`/api/customers/${activeCustomer.maKhachHang}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Lỗi khi cập nhật khách hàng');
      } else {
        alert('Cập nhật thông tin khách hàng thành công');
        setShowEditModal(false);
        fetchCustomers();
      }
    } catch {
      setFormError('Không thể lưu thông tin khách hàng');
    }
  };

  // Delete Customer (UC5.3)
  const handleDeleteCustomer = async () => {
    setDeleteError('');
    try {
      const res = await fetch(`/api/customers/${activeCustomer.maKhachHang}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Không thể xóa khách hàng');
      } else {
        alert('Xóa khách hàng thành công');
        setShowDeleteModal(false);
        fetchCustomers();
      }
    } catch {
      setDeleteError('Lỗi kết nối khi xóa khách hàng');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Quản lý khách hàng</h2>
              <p className="text-xs text-slate-500">
                Thêm, sửa, xóa, tra cứu thông tin khách hàng và xem lịch sử mua hàng (UC5.1 - 5.4)
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khách hàng</span>
          </button>
        </div>

        {/* Filter bar (UC5.4) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tìm theo Mã khách hàng, Tên hoặc Số điện thoại:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ví dụ: KH0001, Nguyễn Văn An, 0905123456..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
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

        {/* Customer Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã KH</th>
                  <th className="py-3 px-4">Tên khách hàng</th>
                  <th className="py-3 px-4">Số điện thoại</th>
                  <th className="py-3 px-4">Địa chỉ</th>
                  <th className="py-3 px-4 text-center">Số đơn đã mua</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Không có khách hàng nào.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => {
                    const invoiceCount = c.hoaDons?.length || 0;
                    return (
                      <tr key={c.maKhachHang} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {c.maKhachHang}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {c.tenKhachHang}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-mono">
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{c.soDienThoai}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {c.diaChi ? (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{c.diaChi}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 italic">--</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              invoiceCount > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {invoiceCount} đơn
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Xem lịch sử (UC5.4) */}
                            <button
                              onClick={() => openDetailModal(c)}
                              className="p-1.5 rounded-lg border border-slate-200 text-emerald-700 hover:bg-emerald-50"
                              title="Xem lịch sử mua hàng (UC5.4)"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Sửa (UC5.2) */}
                            <button
                              onClick={() => openEditModal(c)}
                              className="p-1.5 rounded-lg border border-slate-200 text-blue-700 hover:bg-blue-50"
                              title="Sửa thông tin khách hàng (UC5.2)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Xóa (UC5.3) */}
                            <button
                              onClick={() => {
                                setActiveCustomer(c);
                                setDeleteError('');
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50"
                              title="Xóa thông tin khách hàng (UC5.3)"
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

      {/* MODAL: Thêm khách hàng (UC5.1) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Thêm khách hàng</h3>
              <button
                onClick={() => handleCancelClick('add')}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã khách hàng:
                </label>
                <input
                  type="text"
                  disabled
                  value="Hệ thống tự động sinh (KHxxxx)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên khách hàng: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenKhachHang}
                  onChange={(e) => {
                    setFormData({ ...formData, tenKhachHang: e.target.value });
                    setFormDirty(true);
                  }}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

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
                  placeholder="Đúng 10 chữ số bắt đầu bằng số 0 (09xxxxxxxx)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ (Không bắt buộc):
                </label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => {
                    setFormData({ ...formData, diaChi: e.target.value });
                    setFormDirty(true);
                  }}
                  placeholder="Địa chỉ khách hàng..."
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

      {/* MODAL: Sửa thông tin khách hàng (UC5.2) */}
      {showEditModal && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Sửa thông tin khách hàng</h3>
              <button
                onClick={() => handleCancelClick('edit')}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã khách hàng (Chỉ xem):
                </label>
                <input
                  type="text"
                  disabled
                  value={activeCustomer.maKhachHang}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên khách hàng: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenKhachHang}
                  onChange={(e) => {
                    setFormData({ ...formData, tenKhachHang: e.target.value });
                    setFormDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ:
                </label>
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

      {/* MODAL: Xóa thông tin khách hàng (UC5.3) */}
      {showDeleteModal && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              {/* UC5.3 Main flow step 2 */}
              <h4 className="text-base font-bold text-slate-800">
                Bạn có chắc chắn muốn xóa khách hàng này không?
              </h4>
              <p className="text-xs text-slate-500">
                Khách hàng: <strong>{activeCustomer.tenKhachHang}</strong> ({activeCustomer.soDienThoai})
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
                onClick={handleDeleteCustomer}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Xem thông tin & Lịch sử mua hàng (UC5.4) */}
      {showDetailModal && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Thông tin khách hàng</h3>
                <p className="text-xs text-slate-500">Mã KH: {activeCustomer.maKhachHang}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p>
                Tên khách hàng: <strong>{activeCustomer.tenKhachHang}</strong>
              </p>
              <p>
                Số điện thoại: <strong>{activeCustomer.soDienThoai}</strong>
              </p>
              <p>Địa chỉ: {activeCustomer.diaChi || 'Chưa cập nhật'}</p>
            </div>

            {/* Bảng lịch sử mua hàng */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Bảng lịch sử mua hàng</span>
              </h4>

              {(!activeCustomer.hoaDons || activeCustomer.hoaDons.length === 0) ? (
                // UC5.4 6a.1: Chưa có lịch sử mua hàng
                <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
                  Chưa có lịch sử mua hàng
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                        <th className="p-2 text-left">Mã hóa đơn</th>
                        <th className="p-2 text-left">Ngày giờ bán</th>
                        <th className="p-2 text-right">Tổng tiền</th>
                        <th className="p-2 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeCustomer.hoaDons.map((hd: any) => (
                        <tr key={hd.maHoaDon}>
                          <td className="p-2 font-mono font-bold text-slate-800">
                            {hd.maHoaDon}
                          </td>
                          <td className="p-2 text-slate-600">
                            {formatDateTime(hd.ngayGioBan)}
                          </td>
                          <td className="p-2 text-right font-bold text-emerald-700">
                            {formatVND(hd.tongTien)}
                          </td>
                          <td className="p-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                hd.trangThai === 'Đã hủy'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {hd.trangThai}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* UC5.4 bước 7: Chủ cửa hàng nhấn “Đóng” */}
            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Đóng
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
                {cancelTarget === 'add'
                  ? 'Bạn có chắc chắn muốn hủy thêm khách hàng không?'
                  : 'Bạn có chắc chắn muốn hủy sửa khách hàng không?'}
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
