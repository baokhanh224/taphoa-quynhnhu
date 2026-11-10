'use client';

import React, { useState } from 'react';
import { X, Printer, AlertCircle } from 'lucide-react';
import { formatVND, formatDateTime } from '@/lib/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export default function ReceiptModal({ isOpen, onClose, invoice }: Props) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [printError, setPrintError] = useState('');

  if (!isOpen || !invoice) return null;

  const isCancelled = invoice.trangThai === 'Đã hủy';

  const handlePrint = async () => {
    setPrintError('');

    // Check if cancelled (UC6.2 2a.2)
    if (isCancelled) {
      setPrintError('Hóa đơn đã bị hủy, không thể in');
      return;
    }

    // Check demo error switch for printer (UC6.2 5a.1)
    try {
      const res = await fetch('/api/system/demo-switches');
      const switches = await res.json();
      if (switches.errorPrinter) {
        setPrintError('Không thể kết nối hoặc gửi yêu cầu đến máy in');
        return;
      }
    } catch {}

    // Trigger browser print
    window.print();
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">HÓA ĐƠN BÁN HÀNG</h3>
          </div>
          <button
            onClick={handleCancelClick}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable area */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto" id="printable-receipt">
          {printError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{printError}</span>
            </div>
          )}

          {isCancelled && (
            <div className="p-2 bg-red-100 text-red-800 text-center font-bold text-xs rounded border border-red-300 uppercase tracking-wide">
              Hóa đơn đã bị hủy
            </div>
          )}

          <div className="text-center border-b border-dashed border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-slate-800">TẠP HÓA QUỲNH NHƯ</h2>
            <p className="text-xs text-slate-500">ĐC: Kiot 08 Chợ Hòa Khánh, Liên Chiểu, Đà Nẵng</p>
            <p className="text-xs text-slate-500">SĐT: 0905.123.456 - Giờ mở cửa: 06:00 - 22:00</p>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Mã hóa đơn:</span>
              <span className="font-mono font-bold text-slate-800">{invoice.maHoaDon}</span>
            </div>
            <div className="flex justify-between">
              <span>Ngày giờ bán:</span>
              <span>{formatDateTime(invoice.ngayGioBan)}</span>
            </div>
            {invoice.khachHang && (
              <div className="flex justify-between">
                <span>Khách hàng:</span>
                <span className="font-medium text-slate-800">
                  {invoice.khachHang.tenKhachHang} ({invoice.khachHang.soDienThoai})
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Phương thức thanh toán:</span>
              <span className="font-medium text-slate-800">{invoice.phuongThucThanhToan}</span>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-t border-slate-300 text-slate-600">
                <th className="py-2 text-left">Mặt hàng</th>
                <th className="py-2 text-center">ĐVT</th>
                <th className="py-2 text-center">SL</th>
                <th className="py-2 text-right">Đơn giá</th>
                <th className="py-2 text-right">T.Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.chiTietHoaDons?.map((item: any, idx: number) => (
                <tr key={idx} className="py-1">
                  <td className="py-1.5 font-medium text-slate-800">
                    {item.sanPham?.tenSanPham || 'Sản phẩm'}
                  </td>
                  <td className="py-1.5 text-center text-slate-500">
                    {item.donViBan?.tenDonVi || ''}
                  </td>
                  <td className="py-1.5 text-center font-bold text-slate-700">{item.soLuong}</td>
                  <td className="py-1.5 text-right text-slate-600">{formatVND(item.donGia)}</td>
                  <td className="py-1.5 text-right font-semibold text-slate-800">
                    {formatVND(item.thanhTien)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total summary */}
          <div className="border-t border-dashed border-slate-300 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-sm font-bold text-slate-800">
              <span>TỔNG CỘNG:</span>
              <span className="text-emerald-700">{formatVND(invoice.tongTien)}</span>
            </div>
            {invoice.tienKhachDua !== null && invoice.tienKhachDua !== undefined && (
              <div className="flex justify-between text-slate-600">
                <span>Tiền khách đưa:</span>
                <span>{formatVND(invoice.tienKhachDua)}</span>
              </div>
            )}
            {invoice.tienThua !== null && invoice.tienThua !== undefined && (
              <div className="flex justify-between text-slate-600">
                <span>Tiền thừa:</span>
                <span>{formatVND(invoice.tienThua)}</span>
              </div>
            )}
          </div>

          <div className="text-center border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <p>Cảm ơn quý khách và hẹn gặp lại!</p>
            <p>Quý khách vui lòng giữ hóa đơn để được hỗ trợ đổi/trả hàng.</p>
          </div>
        </div>

        {/* Modal actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancelClick}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>In hóa đơn</span>
          </button>
        </div>
      </div>

      {/* Cancel confirmation dialog (UC6.2 4a.1) */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800">
                Bạn có chắc chắn muốn hủy in hóa đơn không?
              </h4>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
