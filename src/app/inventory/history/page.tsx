'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  FileText,
  Search,
  Calendar,
  AlertTriangle,
  X,
  Eye,
  RefreshCw,
  Truck,
  Package,
} from 'lucide-react';
import { formatVND, formatDateTime, formatDate, formatInputDate } from '@/lib/formatters';

export default function InventoryHistoryPage() {
  const [keyword, setKeyword] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const fetchTickets = async () => {
    // BR-UC4-13: Từ ngày không được lớn hơn Đến ngày
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setErrorMsg('Khoảng thời gian không hợp lệ');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set('keyword', keyword.trim());
      if (fromDate) params.set('fromDate', fromDate);
      if (toDate) params.set('toDate', toDate);

      const res = await fetch(`/api/inventory/import?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        // UC4.4 5b.1: Không thể tải lịch sử nhập hàng
        setErrorMsg(data.error || 'Không thể tải lịch sử nhập hàng');
        setTickets([]);
      } else {
        setTickets(data.importTickets || []);
      }
    } catch {
      setErrorMsg('Không thể tải lịch sử nhập hàng');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setFromDate('');
    setToDate('');
    setErrorMsg('');
    // fetch with clean filters
    fetch('/api/inventory/import')
      .then((res) => res.json())
      .then((data) => setTickets(data.importTickets || []))
      .catch(() => setErrorMsg('Không thể tải lịch sử nhập hàng'));
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-7 h-7 text-emerald-600" />
              Lịch sử nhập hàng
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              UC4.4: Tra cứu các phiếu nhập kho, thông tin nhà cung cấp và chi tiết từng mặt hàng đã nhập
            </p>
          </div>
          <button
            onClick={fetchTickets}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            Làm mới
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Mã phiếu, nhà cung cấp..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Từ ngày</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Đến ngày</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition shadow-sm"
              >
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
              >
                Đặt lại
              </button>
            </div>
          </form>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mb-3" />
              <p className="text-sm">Đang tải lịch sử nhập hàng...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-base font-medium">Không tìm thấy phiếu nhập nào</p>
              <p className="text-xs text-slate-400">Không có dữ liệu trong khoảng thời gian hoặc tiêu chí đã chọn</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <th className="py-3 px-4">Mã phiếu nhập</th>
                    <th className="py-3 px-4">Thời gian nhập</th>
                    <th className="py-3 px-4">Nhà cung cấp</th>
                    <th className="py-3 px-4 text-center">Số mặt hàng</th>
                    <th className="py-3 px-4 text-right">Tổng tiền</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((t) => (
                    <tr key={t.maPhieuNhap} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{t.maPhieuNhap}</td>
                      <td className="py-3 px-4 text-slate-700">{formatDateTime(t.ngayNhap)}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{t.nhaCungCap?.tenNhaCungCap || '—'}</div>
                        <div className="text-xs text-slate-500">{t.nhaCungCap?.soDienThoai}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-700">
                        {t.chiTietNhaps ? t.chiTietNhaps.length : 0}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatVND(t.tongTien)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedTicket(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Chi tiết phiếu nhập hàng
                </h3>
                <p className="text-xs text-emerald-100 font-mono mt-0.5">Mã phiếu: {selectedTicket.maPhieuNhap}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg hover:bg-emerald-700 text-emerald-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Thời gian nhập hàng:</span>
                  <span className="font-semibold text-slate-800">{formatDateTime(selectedTicket.ngayNhap)}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Nhà cung cấp:</span>
                  <span className="font-semibold text-slate-800">{selectedTicket.nhaCungCap?.tenNhaCungCap}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Số điện thoại:</span>
                  <span className="text-slate-700">{selectedTicket.nhaCungCap?.soDienThoai || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Địa chỉ:</span>
                  <span className="text-slate-700">{selectedTicket.nhaCungCap?.diaChi || '—'}</span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Danh sách sản phẩm nhập
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">STT</th>
                        <th className="py-2.5 px-3">Mã SP</th>
                        <th className="py-2.5 px-3">Tên sản phẩm</th>
                        <th className="py-2.5 px-3">Đơn vị nhập</th>
                        <th className="py-2.5 px-3 text-right">SL nhập</th>
                        <th className="py-2.5 px-3 text-right">Đơn giá nhập</th>
                        <th className="py-2.5 px-3 text-right">Thành tiền</th>
                        <th className="py-2.5 px-3 text-center">Hạn sử dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedTicket.chiTietNhaps || []).map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{item.maSanPham}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {item.sanPham?.tenSanPham || item.maSanPham}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {item.donViNhap?.tenDonVi || item.sanPham?.donViTinh || 'Đơn vị'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-800">{item.soLuongNhap}</td>
                          <td className="py-2.5 px-3 text-right text-slate-700">{formatVND(item.giaNhap)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                            {formatVND(item.thanhTien)}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600">
                            {item.hanSuDung ? formatDate(item.hanSuDung) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                        <td colSpan={6} className="py-3 px-3 text-right">
                          Tổng cộng:
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-700 text-sm">
                          {formatVND(selectedTicket.tongTien)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold rounded-lg transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
