'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onSuccess: () => void;
}

export default function CancelInvoiceModal({
  isOpen,
  onClose,
  invoice,
  onSuccess,
}: Props) {
  const [lyDoHuy, setLyDoHuy] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // UC6.3 6a.1: Chưa nhập lý do hủy
    if (!lyDoHuy.trim()) {
      setErrorMsg('Vui lòng nhập lý do hủy hóa đơn');
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = `cancel_${invoice.maHoaDon}_${Date.now()}`;
      const res = await fetch(`/api/sales/${invoice.maHoaDon}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyDoHuy: lyDoHuy.trim(), idempotencyKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Không thể hủy hóa đơn');
      } else {
        alert('Hủy hóa đơn thành công');
        onSuccess();
        onClose();
      }
    } catch {
      setErrorMsg('Không thể hủy hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-red-600 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-200" />
            <h3 className="font-bold text-sm">HỦY HÓA ĐƠN BÁN HÀNG</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm text-slate-700 space-y-1">
            <p>
              Hóa đơn: <strong className="font-mono text-slate-900">{invoice.maHoaDon}</strong>
            </p>
            <p>
              Tổng tiền: <strong className="text-emerald-700">{invoice.tongTien} đ</strong>
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
              Lưu ý: Khi hủy hóa đơn, số lượng hàng đã bán sẽ được tự động hoàn lại kho theo đúng
              các chi tiết phiếu nhập đã xuất trước đó.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nhập lý do hủy hóa đơn: <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={lyDoHuy}
              onChange={(e) => setLyDoHuy(e.target.value)}
              placeholder="Ví dụ: Khách đổi ý không lấy hàng, nhập sai thông tin..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
