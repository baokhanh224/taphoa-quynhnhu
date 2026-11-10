'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Search,
  Receipt,
  Printer,
  RotateCcw,
  Ban,
  Eye,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { formatVND, formatDateTime, formatInputDate } from '@/lib/formatters';
import ReceiptModal from '@/components/sales/ReceiptModal';
import CancelInvoiceModal from '@/components/sales/CancelInvoiceModal';
import ExchangeReturnModal from '@/components/sales/ExchangeReturnModal';

export default function SalesHistoryPage() {
  const [keyword, setKeyword] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected invoice for modals
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);

  const fetchInvoices = async () => {
    setErrorMsg('');
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      // UC6.4 4a.1: Khoảng thời gian không hợp lệ
      setErrorMsg('Khoảng thời gian không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const res = await fetch(`/api/sales?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Không thể tải lịch sử bán hàng');
      } else {
        setInvoices(data.invoices || []);
        if (data.invoices?.length === 0) {
          // UC6.4 5a.1: Không tìm thấy hóa đơn phù hợp
          setErrorMsg('Không tìm thấy hóa đơn phù hợp');
        }
      }
    } catch {
      setErrorMsg('Không thể tải lịch sử bán hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };

  const openAction = async (
    inv: any,
    type: 'detail' | 'print' | 'cancel' | 'exchange'
  ) => {
    try {
      const res = await fetch(`/api/sales/${inv.maHoaDon}`);
      const data = await res.json();
      const fullInv = data.invoice || inv;
      setSelectedInvoice(fullInv);

      if (type === 'detail') setDetailModalOpen(true);
      if (type === 'print') setPrintModalOpen(true);
      if (type === 'cancel') setCancelModalOpen(true);
      if (type === 'exchange') setExchangeModalOpen(true);
    } catch {
      setSelectedInvoice(inv);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Lịch sử bán hàng</h2>
              <p className="text-xs text-slate-500">
                Tra cứu hóa đơn, in phiếu thu, xử lý đổi/trả và hủy giao dịch (UC6.2, 6.3, 6.4, 6.5)
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tìm theo Mã hóa đơn hoặc SĐT khách:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ví dụ: HD0001, 0905123456..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-36">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Từ ngày:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="w-36">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Đến ngày:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
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

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã HĐ</th>
                  <th className="py-3 px-4">Ngày giờ bán</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4 text-right">Tổng tiền</th>
                  <th className="py-3 px-4 text-center">Thanh toán</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Không có hóa đơn nào.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const isCancelled = inv.trangThai === 'Đã hủy';
                    const hasDoiTra = inv.phieuDoiTras && inv.phieuDoiTras.length > 0;

                    return (
                      <tr key={inv.maHoaDon} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {inv.maHoaDon}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {formatDateTime(inv.ngayGioBan)}
                        </td>
                        <td className="py-3 px-4">
                          {inv.khachHang ? (
                            <div>
                              <p className="font-semibold text-slate-800">
                                {inv.khachHang.tenKhachHang}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                {inv.khachHang.soDienThoai}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Khách lẻ</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700">
                          {formatVND(inv.tongTien)}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-slate-600">
                          {inv.phuongThucThanhToan}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isCancelled ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                              Đã hủy
                            </span>
                          ) : hasDoiTra ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                              Có đổi/trả
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Đã thanh toán
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Xem chi tiết */}
                            <button
                              onClick={() => openAction(inv, 'detail')}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                              title="Xem chi tiết hóa đơn"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* In hóa đơn (UC6.2) */}
                            <button
                              onClick={() => openAction(inv, 'print')}
                              className="p-1.5 rounded-lg border border-slate-200 text-emerald-700 hover:bg-emerald-50"
                              title="In hóa đơn (UC6.2)"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* Đổi/trả hàng (UC6.5) */}
                            <button
                              onClick={() => openAction(inv, 'exchange')}
                              disabled={isCancelled}
                              className={`p-1.5 rounded-lg border transition ${
                                isCancelled
                                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                                  : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                              }`}
                              title="Đổi/trả hàng (UC6.5)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>

                            {/* Hủy hóa đơn (UC6.3) */}
                            <button
                              onClick={() => openAction(inv, 'cancel')}
                              disabled={isCancelled || hasDoiTra}
                              className={`p-1.5 rounded-lg border transition ${
                                isCancelled || hasDoiTra
                                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                                  : 'border-red-200 text-red-600 hover:bg-red-50'
                              }`}
                              title={
                                hasDoiTra
                                  ? 'Hóa đơn có giao dịch đổi/trả hàng, không thể hủy trực tiếp'
                                  : 'Hủy hóa đơn (UC6.3)'
                              }
                            >
                              <Ban className="w-3.5 h-3.5" />
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

      {/* Invoice Detail Modal */}
      {detailModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Chi tiết hóa đơn {selectedInvoice.maHoaDon}
                </h3>
                <p className="text-xs text-slate-500">
                  {formatDateTime(selectedInvoice.ngayGioBan)}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  selectedInvoice.trangThai === 'Đã hủy'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {selectedInvoice.trangThai}
              </span>
            </div>

            {selectedInvoice.lyDoHuy && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-0.5">
                <p>
                  <strong>Lý do hủy:</strong> {selectedInvoice.lyDoHuy}
                </p>
                <p>
                  <strong>Thời gian hủy:</strong>{' '}
                  {formatDateTime(selectedInvoice.thoiGianHuy)}
                </p>
              </div>
            )}

            {selectedInvoice.khachHang && (
              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
                <p>
                  Khách hàng: <strong>{selectedInvoice.khachHang.tenKhachHang}</strong>
                </p>
                <p>Số điện thoại: {selectedInvoice.khachHang.soDienThoai}</p>
              </div>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                    <th className="p-2 text-left">Sản phẩm</th>
                    <th className="p-2 text-center">ĐVT</th>
                    <th className="p-2 text-center">SL</th>
                    <th className="p-2 text-right">Đơn giá</th>
                    <th className="p-2 text-right">T.Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.chiTietHoaDons?.map((line: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium text-slate-800">
                        {line.sanPham?.tenSanPham || 'Sản phẩm'}
                      </td>
                      <td className="p-2 text-center text-slate-500">
                        {line.donViBan?.tenDonVi || ''}
                      </td>
                      <td className="p-2 text-center font-bold text-slate-700">{line.soLuong}</td>
                      <td className="p-2 text-right text-slate-600">{formatVND(line.donGia)}</td>
                      <td className="p-2 text-right font-bold text-emerald-700">
                        {formatVND(line.thanhTien)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-200">
              <span>Tổng tiền thanh toán:</span>
              <span className="text-emerald-700 text-base">
                {formatVND(selectedInvoice.tongTien)}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ReceiptModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        invoice={selectedInvoice}
      />

      <CancelInvoiceModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        invoice={selectedInvoice}
        onSuccess={fetchInvoices}
      />

      <ExchangeReturnModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        invoice={selectedInvoice}
        onSuccess={fetchInvoices}
      />
    </AppLayout>
  );
}
