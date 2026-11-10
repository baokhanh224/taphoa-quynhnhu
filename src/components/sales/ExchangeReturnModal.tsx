'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, X, AlertCircle, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@/lib/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onSuccess: () => void;
}

export default function ExchangeReturnModal({
  isOpen,
  onClose,
  invoice,
  onSuccess,
}: Props) {
  const [returnItems, setReturnItems] = useState<
    Array<{
      maChiTietHoaDon: string;
      tenSanPham: string;
      tenDonVi: string;
      soLuongMua: number;
      soLuongConDuocTra: number;
      donGia: number;
      soLuongTra: number;
      duocNhapLaiKho: boolean;
      selected: boolean;
    }>
  >([]);

  // Exchange items
  const [isOnlyReturn, setIsOnlyReturn] = useState(false);
  const [exchangeItems, setExchangeItems] = useState<
    Array<{
      maSanPham: string;
      maDonVi: string;
      tenSanPham: string;
      tenDonVi: string;
      soLuong: number;
      donGia: number;
      thanhTien: number;
      availableStock: number;
    }>
  >([]);

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedExchProdId, setSelectedExchProdId] = useState('');
  const [selectedExchUnitId, setSelectedExchUnitId] = useState('');
  const [exchQty, setExchQty] = useState(1);

  const [moneyConfirmed, setMoneyConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && invoice) {
      setErrorMsg('');
      setMoneyConfirmed(false);
      setIsOnlyReturn(false);
      setExchangeItems([]);

      // Check if invoice can be returned
      if (invoice.trangThai === 'Đã hủy') {
        setErrorMsg('Hóa đơn không thể đổi/trả hàng');
        return;
      }

      // Calculate remaining returnable per detail
      const previousReturns = (invoice.phieuDoiTras || []).flatMap((dt: any) =>
        (dt.chiTietDoiTras || []).filter((c: any) => c.loaiDong === 'Hàng trả')
      );

      const items = (invoice.chiTietHoaDons || []).map((line: any) => {
        const returnedQty = previousReturns
          .filter((c: any) => c.maChiTietHoaDon === line.maChiTietHoaDon)
          .reduce((sum: number, c: any) => sum + c.soLuong, 0);

        const remaining = Math.max(0, line.soLuong - returnedQty);

        return {
          maChiTietHoaDon: line.maChiTietHoaDon,
          tenSanPham: line.sanPham?.tenSanPham || 'Sản phẩm',
          tenDonVi: line.donViBan?.tenDonVi || '',
          soLuongMua: line.soLuong,
          soLuongConDuocTra: remaining,
          donGia: Number(line.donGia),
          soLuongTra: 1,
          duocNhapLaiKho: true, // Step 5: mặc định mỗi dòng hàng trả được nhập lại kho
          selected: false,
        };
      });

      const totalRemaining = items.reduce(
        (sum: number, i: any) => sum + i.soLuongConDuocTra,
        0
      );
      if (totalRemaining === 0) {
        setErrorMsg('Hóa đơn không thể đổi/trả hàng');
      }

      setReturnItems(items);

      // Load products for exchange
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          setAvailableProducts(data.products || []);
          if (data.products?.length > 0) {
            setSelectedExchProdId(data.products[0].maSanPham);
            if (data.products[0].donViQuyDois?.length > 0) {
              setSelectedExchUnitId(data.products[0].donViQuyDois[0].maDonVi);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen, invoice]);

  if (!isOpen || !invoice) return null;

  // Selected return items
  const activeReturns = returnItems.filter((i) => i.selected);

  // Totals
  const tongTienHangTra = activeReturns.reduce(
    (sum, i) => sum + i.soLuongTra * i.donGia,
    0
  );

  const tongTienHangDoi = isOnlyReturn
    ? 0
    : exchangeItems.reduce((sum, i) => sum + i.thanhTien, 0);

  const tienChenhLech = tongTienHangDoi - tongTienHangTra;

  const handleAddExchangeItem = () => {
    setErrorMsg('');
    const prod = availableProducts.find((p) => p.maSanPham === selectedExchProdId);
    if (!prod) return;
    const unit = prod.donViQuyDois.find((u: any) => u.maDonVi === selectedExchUnitId);
    if (!unit) return;

    const qty = Number(exchQty);
    if (qty <= 0) {
      setErrorMsg('Số lượng đổi không hợp lệ');
      return;
    }

    const neededBase = qty * unit.heSoQuyDoi;
    if (prod.soLuongTon < neededBase) {
      setErrorMsg('Không đủ số lượng hàng có thể bán');
      return;
    }

    const price = Number(unit.giaBan);
    const item = {
      maSanPham: prod.maSanPham,
      maDonVi: unit.maDonVi,
      tenSanPham: prod.tenSanPham,
      tenDonVi: unit.tenDonVi,
      soLuong: qty,
      donGia: price,
      thanhTien: qty * price,
      availableStock: prod.soLuongTon,
    };

    setExchangeItems((prev) => [...prev, item]);
    setExchQty(1);
  };

  const handleRemoveExchangeItem = (index: number) => {
    setExchangeItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    setErrorMsg('');

    if (activeReturns.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất một sản phẩm cần trả');
      return;
    }

    // Validate return quantities (UC6.5 4a.1)
    for (const r of activeReturns) {
      if (
        r.soLuongTra <= 0 ||
        !Number.isInteger(r.soLuongTra) ||
        r.soLuongTra > r.soLuongConDuocTra
      ) {
        setErrorMsg('Số lượng trả không hợp lệ');
        return;
      }
    }

    // Money confirmation check (UC6.5 9a.1)
    if (tienChenhLech !== 0 && !moneyConfirmed) {
      setErrorMsg('Vui lòng xác nhận đã xử lý tiền chênh lệch');
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = `dt_${invoice.maHoaDon}_${Date.now()}`;
      const payload = {
        idempotencyKey,
        moneyConfirmed: true,
        itemsReturn: activeReturns.map((r) => ({
          maChiTietHoaDon: r.maChiTietHoaDon,
          soLuongTra: r.soLuongTra,
          duocNhapLaiKho: r.duocNhapLaiKho,
        })),
        itemsExchange: isOnlyReturn
          ? []
          : exchangeItems.map((e) => ({
              maSanPham: e.maSanPham,
              maDonVi: e.maDonVi,
              soLuong: e.soLuong,
            })),
      };

      const res = await fetch(`/api/sales/${invoice.maHoaDon}/exchange-return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Không thể lưu phiếu đổi/trả');
      } else {
        alert('Xử lý đổi/trả hàng thành công');
        onSuccess();
        onClose();
      }
    } catch {
      setErrorMsg('Không thể lưu phiếu đổi/trả');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">XỬ LÝ ĐỔI / TRẢ HÀNG</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Invoice Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between text-xs text-slate-700">
            <div>
              <span>Mã hóa đơn gốc: </span>
              <strong className="font-mono text-slate-900">{invoice.maHoaDon}</strong>
            </div>
            <div>
              <span>Tổng tiền gốc: </span>
              <strong className="text-emerald-700">{formatVND(invoice.tongTien)}</strong>
            </div>
          </div>

          {/* Step 1: Chọn sản phẩm trả */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Danh sách sản phẩm mua được phép trả:
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                    <th className="p-2 text-center w-10">Chọn</th>
                    <th className="p-2 text-left">Tên sản phẩm</th>
                    <th className="p-2 text-center">ĐVT</th>
                    <th className="p-2 text-center">Đã mua</th>
                    <th className="p-2 text-center">Còn được trả</th>
                    <th className="p-2 text-right">Đơn giá</th>
                    <th className="p-2 text-center w-24">SL Trả</th>
                    <th className="p-2 text-center">Nhập lại kho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {returnItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={item.selected ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          disabled={item.soLuongConDuocTra === 0}
                          checked={item.selected}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setReturnItems((prev) =>
                              prev.map((r, i) => (i === idx ? { ...r, selected: val } : r))
                            );
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-2 font-medium text-slate-800">{item.tenSanPham}</td>
                      <td className="p-2 text-center text-slate-500">{item.tenDonVi}</td>
                      <td className="p-2 text-center text-slate-600">{item.soLuongMua}</td>
                      <td className="p-2 text-center font-bold text-emerald-700">
                        {item.soLuongConDuocTra}
                      </td>
                      <td className="p-2 text-right text-slate-700">{formatVND(item.donGia)}</td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={1}
                          max={item.soLuongConDuocTra}
                          disabled={!item.selected || item.soLuongConDuocTra === 0}
                          value={item.soLuongTra}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 1;
                            setReturnItems((prev) =>
                              prev.map((r, i) => (i === idx ? { ...r, soLuongTra: val } : r))
                            );
                          }}
                          className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-xs focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <label className="inline-flex items-center space-x-1 cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!item.selected}
                            checked={item.duocNhapLaiKho}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setReturnItems((prev) =>
                                prev.map((r, i) =>
                                  i === idx ? { ...r, duocNhapLaiKho: val } : r
                                )
                              );
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span className="text-[11px] text-slate-600">
                            {item.duocNhapLaiKho ? 'Có' : 'Không'}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-xs text-slate-700">
              Tổng tiền hàng trả: <strong className="text-emerald-700 font-bold">{formatVND(tongTienHangTra)}</strong>
            </div>
          </div>

          {/* Step 2: Hàng đổi hoặc Chỉ trả hàng */}
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Sản phẩm đổi mới (Tùy chọn):
              </h4>
              <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={isOnlyReturn}
                  onChange={(e) => setIsOnlyReturn(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Chỉ trả hàng (Không đổi lấy hàng mới)</span>
              </label>
            </div>

            {!isOnlyReturn && (
              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Chọn sản phẩm đổi:
                    </label>
                    <select
                      value={selectedExchProdId}
                      onChange={(e) => {
                        setSelectedExchProdId(e.target.value);
                        const prod = availableProducts.find((p) => p.maSanPham === e.target.value);
                        if (prod?.donViQuyDois?.length > 0) {
                          setSelectedExchUnitId(prod.donViQuyDois[0].maDonVi);
                        }
                      }}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      {availableProducts.map((p) => (
                        <option key={p.maSanPham} value={p.maSanPham}>
                          {p.tenSanPham} (Tồn: {p.soLuongTon} {p.donViTinh})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Đơn vị bán:
                    </label>
                    <select
                      value={selectedExchUnitId}
                      onChange={(e) => setSelectedExchUnitId(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      {availableProducts
                        .find((p) => p.maSanPham === selectedExchProdId)
                        ?.donViQuyDois?.map((u: any) => (
                          <option key={u.maDonVi} value={u.maDonVi}>
                            {u.tenDonVi} ({formatVND(u.giaBan)})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-20">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Số lượng:
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={exchQty}
                      onChange={(e) => setExchQty(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs text-center"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddExchangeItem}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                </div>

                {/* Table of exchange items */}
                {exchangeItems.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white mt-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                          <th className="p-2 text-left">Sản phẩm đổi</th>
                          <th className="p-2 text-center">ĐVT</th>
                          <th className="p-2 text-center">SL</th>
                          <th className="p-2 text-right">Đơn giá</th>
                          <th className="p-2 text-right">Thành tiền</th>
                          <th className="p-2 text-center w-10">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {exchangeItems.map((ex, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium text-slate-800">{ex.tenSanPham}</td>
                            <td className="p-2 text-center text-slate-500">{ex.tenDonVi}</td>
                            <td className="p-2 text-center font-bold text-slate-700">{ex.soLuong}</td>
                            <td className="p-2 text-right text-slate-600">{formatVND(ex.donGia)}</td>
                            <td className="p-2 text-right font-bold text-emerald-700">
                              {formatVND(ex.thanhTien)}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handleRemoveExchangeItem(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="text-right text-xs text-slate-700">
                  Tổng tiền hàng đổi: <strong className="text-emerald-700 font-bold">{formatVND(tongTienHangDoi)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Tính toán tiền chênh lệch & Xác nhận */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Tổng tiền hàng khách trả:</span>
              <span>{formatVND(tongTienHangTra)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Tổng tiền hàng đổi mới:</span>
              <span>{formatVND(tongTienHangDoi)}</span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">
                {tienChenhLech > 0
                  ? 'SỐ TIỀN CẦN THU THÊM CỦA KHÁCH:'
                  : tienChenhLech < 0
                  ? 'SỐ TIỀN CẦN HOÀN LẠI CHO KHÁCH:'
                  : 'TIỀN CHÊNH LỆCH:'}
              </span>
              <span
                className={`text-base font-extrabold ${
                  tienChenhLech > 0
                    ? 'text-blue-700'
                    : tienChenhLech < 0
                    ? 'text-amber-700'
                    : 'text-slate-700'
                }`}
              >
                {formatVND(Math.abs(tienChenhLech))}
              </span>
            </div>

            {tienChenhLech !== 0 && (
              <div className="pt-2 border-t border-emerald-200">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moneyConfirmed}
                    onChange={(e) => setMoneyConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>
                    {tienChenhLech > 0
                      ? `Xác nhận đã thu thêm đủ ${formatVND(tienChenhLech)}`
                      : `Xác nhận đã hoàn trả đủ ${formatVND(Math.abs(tienChenhLech))} cho khách`}
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Đang lưu...' : 'Hoàn tất đổi/trả'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
