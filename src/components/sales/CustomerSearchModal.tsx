'use client';

import React, { useState } from 'react';
import { Search, X, UserCheck, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: any) => void;
}

export default function CustomerSearchModal({ isOpen, onClose, onSelectCustomer }: Props) {
  const [phone, setPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setFoundCustomer(null);

    const clean = phone.trim();
    if (!clean) {
      setErrorMsg('Vui lòng nhập số điện thoại khách hàng');
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/customers?keyword=${encodeURIComponent(clean)}`);
      const data = await res.json();
      const match = data.customers?.find((c: any) => c.soDienThoai === clean);

      if (match) {
        setFoundCustomer(match);
      } else {
        // Exact specification string: "Không tìm thấy khách hàng"
        setErrorMsg('Không tìm thấy khách hàng');
      }
    } catch {
      setErrorMsg('Lỗi kết nối khi tìm khách hàng');
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = () => {
    if (foundCustomer) {
      onSelectCustomer(foundCustomer);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-slate-200">
        <div className="bg-emerald-700 text-white px-5 py-3.5 flex items-center justify-between">
          <h3 className="font-bold text-sm">GẮN KHÁCH HÀNG</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Nhập số điện thoại khách hàng:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0905123456"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tìm</span>
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {foundCustomer && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center space-x-1 text-emerald-800 font-bold">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Đã tìm thấy thông tin khách hàng:</span>
              </div>
              <p className="text-slate-700">
                Tên khách hàng: <strong>{foundCustomer.tenKhachHang}</strong>
              </p>
              <p className="text-slate-600">
                Số điện thoại: <strong>{foundCustomer.soDienThoai}</strong>
              </p>
              {foundCustomer.diaChi && (
                <p className="text-slate-500 text-[11px]">Địa chỉ: {foundCustomer.diaChi}</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Đóng
          </button>
          {foundCustomer && (
            <button
              type="button"
              onClick={handleSelect}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Chọn khách hàng này
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
