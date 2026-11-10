'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Sliders,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  X,
  History,
} from 'lucide-react';
import { formatDateTime, formatDate } from '@/lib/formatters';

export default function InventoryAdjustPage() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedLot, setSelectedLot] = useState<any>(null);

  const [soLuongMoi, setSoLuongMoi] = useState('');
  const [lyDo, setLyDo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectProduct = async (p: any) => {
    setErrorMsg('');
    try {
      const res = await fetch(`/api/products/${p.maSanPham}`);
      const data = await res.json();
      setSelectedProduct(data.product);
      if (data.product?.chiTietNhaps?.length > 0) {
        setSelectedLot(data.product.chiTietNhaps[0]);
        setSoLuongMoi(String(data.product.chiTietNhaps[0].soLuongCon));
      } else {
        setSelectedLot(null);
        setSoLuongMoi('');
      }
      setLyDo('');
    } catch {
      setSelectedProduct(p);
    }
  };

  const handleSelectLot = (lot: any) => {
    setSelectedLot(lot);
    setSoLuongMoi(String(lot.soLuongCon));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedProduct || !selectedLot) {
      setErrorMsg('Vui lòng chọn sản phẩm và lô hàng cần điều chỉnh');
      return;
    }

    // UC4.2 7a.1: Thiếu thông tin bắt buộc
    if (soLuongMoi.trim() === '' || !lyDo.trim()) {
      setErrorMsg('Không được để trống');
      return;
    }

    // UC4.2 7b.2: Số lượng điều chỉnh không hợp lệ
    const num = Number(soLuongMoi);
    if (isNaN(num) || !Number.isInteger(num) || num < 0) {
      setErrorMsg('Số lượng điều chỉnh không hợp lệ');
      return;
    }

    // Section 4 decision: Không vượt số lượng đã nhập của chi tiết đó
    const maxImportedBase = selectedLot.soLuongNhap * selectedLot.tyLeQuyDoi;
    if (num > maxImportedBase) {
      setErrorMsg('Số lượng điều chỉnh không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maSanPham: selectedProduct.maSanPham,
          maChiTietNhap: selectedLot.maChiTietNhap,
          soLuongMoi: num,
          lyDo: lyDo.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // UC4.2 8a.1: Không thể lưu phiếu điều chỉnh
        setErrorMsg(data.error || 'Không thể lưu phiếu điều chỉnh');
      } else {
        alert('Điều chỉnh tồn kho thành công');
        handleSelectProduct(selectedProduct);
        fetchProducts();
      }
    } catch {
      setErrorMsg('Không thể lưu phiếu điều chỉnh');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!keyword.trim()) return true;
    const kw = keyword.toLowerCase().trim();
    return (
      p.tenSanPham.toLowerCase().includes(kw) ||
      p.maSanPham.toLowerCase().includes(kw) ||
      (p.maVach && p.maVach.toLowerCase().includes(kw))
    );
  });

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Title */}
        <div className="flex items-center space-x-2.5">
          <Sliders className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Điều chỉnh tồn kho</h2>
            <p className="text-xs text-slate-500">
              Cân đối số lượng thực tế, trừ kho khi hàng hỏng hoặc hết hạn theo từng chi tiết phiếu
              nhập (UC4.2)
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Product Search List (5 cols) */}
          <div className="lg:col-span-5 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Tìm sản phẩm cần điều chỉnh (UC4.2 Bước 3):
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập tên hoặc mã sản phẩm..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct?.maSanPham === p.maSanPham;
                return (
                  <div
                    key={p.maSanPham}
                    onClick={() => handleSelectProduct(p)}
                    className={`p-3 rounded-xl cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50 border border-emerald-300'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {p.maSanPham}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800">{p.tenSanPham}</h4>
                        <p className="text-[11px] text-slate-500">ĐVT: {p.donViTinh}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        Tồn: {p.soLuongTon} {p.donViTinh}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Lot Detail & Adjustment Form (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedProduct ? (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedProduct.tenSanPham} ({selectedProduct.maSanPham})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tổng tồn kho hiện tại:{' '}
                      <strong className="text-emerald-700 font-bold">
                        {selectedProduct.soLuongTon} {selectedProduct.donViTinh}
                      </strong>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (soLuongMoi || lyDo) setShowCancelPrompt(true);
                      else setSelectedProduct(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Hủy chọn
                  </button>
                </div>

                {/* UC4.2 Main flow step 4: Danh sách chi tiết phiếu nhập */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Chọn chi tiết phiếu nhập cần điều chỉnh:
                  </h4>

                  {(!selectedProduct.chiTietNhaps || selectedProduct.chiTietNhaps.length === 0) ? (
                    <div className="p-4 bg-slate-50 text-center text-xs text-slate-500 rounded-xl">
                      Chưa có chi tiết phiếu nhập nào cho sản phẩm này.
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                            <th className="p-2 text-center w-12">Chọn</th>
                            <th className="p-2 text-left">Mã lô / Phiếu</th>
                            <th className="p-2 text-center">Hạn sử dụng</th>
                            <th className="p-2 text-center">SL nhập</th>
                            <th className="p-2 text-center">SL còn hiện tại</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedProduct.chiTietNhaps.map((lot: any) => {
                            const isChosen = selectedLot?.maChiTietNhap === lot.maChiTietNhap;
                            return (
                              <tr
                                key={lot.maChiTietNhap}
                                onClick={() => handleSelectLot(lot)}
                                className={`cursor-pointer transition ${
                                  isChosen ? 'bg-emerald-50' : 'hover:bg-slate-50'
                                }`}
                              >
                                <td className="p-2 text-center">
                                  <input
                                    type="radio"
                                    checked={isChosen}
                                    onChange={() => handleSelectLot(lot)}
                                    className="text-emerald-600"
                                  />
                                </td>
                                <td className="p-2">
                                  <span className="font-mono font-bold text-slate-800">
                                    {lot.maChiTietNhap}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block font-mono">
                                    Phiếu: {lot.maPhieuNhap}
                                  </span>
                                </td>
                                <td className="p-2 text-center">
                                  {lot.hanSuDung ? (
                                    <span className="font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 text-[11px]">
                                      {formatDate(lot.hanSuDung)}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">--</span>
                                  )}
                                </td>
                                <td className="p-2 text-center text-slate-600 font-mono">
                                  {lot.soLuongNhap * lot.tyLeQuyDoi} {selectedProduct.donViTinh}
                                </td>
                                <td className="p-2 text-center font-bold text-emerald-700 font-mono">
                                  {lot.soLuongCon} {selectedProduct.donViTinh}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Adjustment inputs (UC4.2 Main flow step 5) */}
                {selectedLot && (
                  <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      3. Nhập số lượng mới và lý do:
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          Số lượng cũ hiện tại:
                        </label>
                        <input
                          type="text"
                          disabled
                          value={`${selectedLot.soLuongCon} ${selectedProduct.donViTinh}`}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Số lượng tồn mới ({selectedProduct.donViTinh}): <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={soLuongMoi}
                          onChange={(e) => setSoLuongMoi(e.target.value)}
                          placeholder="Nhập số lượng thực tế..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Lý do điều chỉnh: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={lyDo}
                        onChange={(e) => setLyDo(e.target.value)}
                        placeholder="Ví dụ: Kiểm kê định kỳ phát hiện sai lệch, hủy hàng hỏng/hết hạn..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowCancelPrompt(true)}
                        className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-400 space-y-2">
                <Sliders className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-xs">
                  Vui lòng chọn một sản phẩm từ danh sách bên trái để thực hiện điều chỉnh tồn kho.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM CANCEL (UC4.2 6a.2) */}
      {showCancelPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800">
                Bạn có chắc chắn muốn hủy điều chỉnh tồn kho không?
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
                onClick={() => {
                  setShowCancelPrompt(false);
                  setSoLuongMoi('');
                  setLyDo('');
                  setSelectedProduct(null);
                }}
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
