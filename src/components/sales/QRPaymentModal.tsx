'use client';

import React from 'react';
import { X, QrCode, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@/lib/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onConfirmReceived: () => void;
}

export default function QRPaymentModal({
  isOpen,
  onClose,
  amount,
  onConfirmReceived,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
        <div className="bg-blue-600 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-sm">THANH TOÁN CHUYỂN KHOẢN</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Số tiền cần chuyển:
            </p>
            <p className="text-2xl font-extrabold text-blue-700">{formatVND(amount)}</p>
          </div>

          {/* QR Code SVG / Mockup styled per VietQR Figma style */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-blue-200 inline-block mx-auto shadow-inner">
            <svg
              className="w-44 h-44 mx-auto text-slate-800"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Decorative QR code matrix */}
              <rect x="5" y="5" width="25" height="25" rx="3" fill="#1e293b" />
              <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="13" y="13" width="9" height="9" fill="#2563eb" />

              <rect x="70" y="5" width="25" height="25" rx="3" fill="#1e293b" />
              <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="78" y="13" width="9" height="9" fill="#2563eb" />

              <rect x="5" y="70" width="25" height="25" rx="3" fill="#1e293b" />
              <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
              <rect x="13" y="78" width="9" height="9" fill="#2563eb" />

              {/* Data modules */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="46" y="8" width="6" height="6" />
              <rect x="56" y="8" width="6" height="6" />
              <rect x="36" y="18" width="6" height="6" />
              <rect x="46" y="24" width="8" height="8" />
              <rect x="56" y="18" width="6" height="6" />

              <rect x="8" y="36" width="6" height="6" />
              <rect x="18" y="36" width="6" height="6" />
              <rect x="8" y="46" width="6" height="6" />
              <rect x="8" y="56" width="6" height="6" />
              <rect x="18" y="56" width="6" height="6" />

              <rect x="34" y="34" width="32" height="32" rx="4" fill="#2563eb" opacity="0.1" />
              <text x="50" y="53" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#2563eb">
                QUỲNH NHƯ
              </text>

              <rect x="72" y="36" width="8" height="6" />
              <rect x="84" y="36" width="8" height="6" />
              <rect x="72" y="48" width="6" height="8" />
              <rect x="84" y="48" width="8" height="8" />

              <rect x="36" y="72" width="6" height="6" />
              <rect x="48" y="72" width="8" height="6" />
              <rect x="62" y="72" width="6" height="6" />
              <rect x="76" y="72" width="8" height="8" />
              <rect x="40" y="84" width="8" height="8" />
              <rect x="56" y="84" width="8" height="8" />
              <rect x="76" y="86" width="8" height="8" />
            </svg>
            <p className="text-[11px] font-mono text-slate-500 mt-2">VietQR • MB BANK</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1">
            <p className="text-slate-600">
              Chủ TK: <strong className="text-slate-800">TAP HOA QUYNH NHU</strong>
            </p>
            <p className="text-slate-600">
              Số TK: <strong className="text-slate-800 font-mono">0905123456</strong> (MB Bank)
            </p>
            <p className="text-slate-600">
              Nội dung: <strong className="text-slate-800 font-mono">THANH TOAN DON HANG</strong>
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReceived();
              onClose();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận đã nhận đủ tiền</span>
          </button>
        </div>
      </div>
    </div>
  );
}
