'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  PackagePlus,
  Plus,
  Trash2,
  AlertTriangle,
  X,
  Truck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { formatVND } from '@/lib/formatters';

interface ImportLine {
  maSanPham: string;
  tenSanPham: string;
  maDonViNhap: string;
  tenDonViNhap: string;
  tyLeQuyDoi: number;
  soLuongNhap: string;
  giaNhap: string;
  thanhTien: number;
  hanSuDung: string;
  quanLyHanSuDung: boolean;
  availableUnits: any[];
}

export default function InventoryImportPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [importLines, setImportLines] = useState<ImportLine[]>([]);

  // Add line fields
  const [selectedProdId, setSelectedProdId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [inputQty, setInputQty] = useState('1');
  const [inputPrice, setInputPrice] = useState('');
  const [inputExpiry, setInputExpiry] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  useEffect(() => {
    fetch('/api/suppliers')
      .then((res) => res.json())
      .then((data) => {
        const activeSups = (data.suppliers || []).filter(
          (s: any) => s.trangThai === 'Đang hợp tác'
        );
        setSuppliers(activeSups);
        if (activeSups.length > 0) setSelectedSupplier(activeSups[0].maNhaCungCap);
      })
      .catch(() => {});

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const prods = data.products || [];
        setProducts(prods);
        if (prods.length > 0) {
          setSelectedProdId(prods[0].maSanPham);
          if (prods[0].donViQuyDois?.length > 0) {
            setSelectedUnitId(prods[0].donViQuyDois[0].maDonVi);
          }
          setInputPrice(String(prods[0].giaNhapBinhQuan || ''));
        }
      })
      .catch(() => {});
  }, []);

  const handleProductSelectChange = (prodId: string) => {
    setSelectedProdId(prodId);
    const prod = products.find((p) => p.maSanPham === prodId);
    if (prod) {
      if (prod.donViQuyDois?.length > 0) {
        setSelectedUnitId(prod.donViQuyDois[0].maDonVi);
      }
      setInputPrice(String(prod.giaNhapBinhQuan || ''));
      setInputExpiry('');
    }
  };

  const currentProd = products.find((p) => p.maSanPham === selectedProdId);

  // Add line to ticket (UC4.1 step 4)
  const handleAddLine = () => {
    setErrorMsg('');
    if (!selectedProdId) return;

    const prod = products.find((p) => p.maSanPham === selectedProdId);
    if (!prod) return;
    const unit = prod.donViQuyDois?.find((u: any) => u.maDonVi === selectedUnitId);
    if (!unit) return;

    // Validation
    const qty = Number(inputQty);
    const price = Number(inputPrice);

    // 5a.2: Bỏ trống thông tin bắt buộc
    if (!inputQty.trim() || !inputPrice.trim()) {
      setErrorMsg('Không được để trống');
      return;
    }

    // 5b.2: Số lượng nhập và giá nhập phải lớn hơn 0
    if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
      setErrorMsg('Số lượng nhập và giá nhập phải lớn hơn 0');
      return;
    }

    // 5c.2 (7c.1): Hạn sử dụng phải sau ngày nhập hàng
    if (prod.quanLyHanSuDung) {
      if (!inputExpiry.trim()) {
        setErrorMsg('Không được để trống');
        return;
      }
      const expDate = new Date(inputExpiry);
      expDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expDate <= today) {
        setErrorMsg('Hạn sử dụng phải sau ngày nhập hàng');
        return;
      }
    }

    const newLine: ImportLine = {
      maSanPham: prod.maSanPham,
      tenSanPham: prod.tenSanPham,
      maDonViNhap: unit.maDonVi,
      tenDonViNhap: unit.tenDonVi,
      tyLeQuyDoi: unit.heSoQuyDoi,
      soLuongNhap: String(qty),
      giaNhap: String(price),
      thanhTien: qty * price,
      hanSuDung: inputExpiry,
      quanLyHanSuDung: prod.quanLyHanSuDung,
      availableUnits: prod.donViQuyDois || [],
    };

    setImportLines((prev) => [...prev, newLine]);
    setInputQty('1');
    setInputExpiry('');
  };

  const removeLine = (idx: number) => {
    setImportLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalTicketAmount = importLines.reduce((sum, item) => sum + item.thanhTien, 0);

  // Submit ticket (UC4.1 step 6)
  const handleSubmitTicket = async () => {
    setErrorMsg('');

    if (!selectedSupplier) {
      setErrorMsg('Không được để trống');
      return;
    }

    if (importLines.length === 0) {
      setErrorMsg('Vui lòng thêm ít nhất một sản phẩm nhập');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maNhaCungCap: selectedSupplier,
          items: importLines.map((line) => ({
            maSanPham: line.maSanPham,
            maDonViNhap: line.maDonViNhap,
            soLuongNhap: Number(line.soLuongNhap),
            giaNhap: Number(line.giaNhap),
            hanSuDung: line.hanSuDung || null,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // UC4.1 8a.1: Không thể lưu phiếu nhập
        setErrorMsg(data.error || 'Không thể lưu phiếu nhập');
      } else {
        alert('Nhập hàng thành công');
        setImportLines([]);
      }
    } catch {
      setErrorMsg('Không thể lưu phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (importLines.length > 0) {
      // UC4.1 2a.2: Bạn có chắc chắn muốn hủy nhập hàng không?
      setShowCancelPrompt(true);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <PackagePlus className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Nhập hàng từ nhà cung cấp</h2>
              <p className="text-xs text-slate-500">
                Lập phiếu nhập hàng, cộng số lượng kho và tính lại giá nhập bình quân (UC4.1)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancelClick}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Hủy
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Supplier selection & Line item builder */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chọn nhà cung cấp: <span className="text-red-500">*</span></span>
            </label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {suppliers.map((s) => (
                <option key={s.maNhaCungCap} value={s.maNhaCungCap}>
                  {s.tenNhaCungCap} ({s.soDienThoai})
                </option>
              ))}
            </select>
          </div>

          {/* Add product line form (UC4.1 Main flow step 4) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Thêm sản phẩm vào phiếu nhập:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sản phẩm:
                </label>
                <select
                  value={selectedProdId}
                  onChange={(e) => handleProductSelectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                >
                  {products.map((p) => (
                    <option key={p.maSanPham} value={p.maSanPham}>
                      {p.tenSanPham} {p.quanLyHanSuDung ? '(Có QL hạn)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Đơn vị nhập:
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                >
                  {currentProd?.donViQuyDois?.map((u: any) => (
                    <option key={u.maDonVi} value={u.maDonVi}>
                      {u.tenDonVi} (x{u.heSoQuyDoi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Số lượng nhập:
                </label>
                <input
                  type="number"
                  min={1}
                  value={inputQty}
                  onChange={(e) => setInputQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Giá nhập (VNĐ):
                </label>
                <input
                  type="number"
                  min={1}
                  value={inputPrice}
                  onChange={(e) => setInputPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Expiry Date (UC4.1 6b: Hạn sử dụng cho sản phẩm có quản lý hạn) */}
            <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
              {currentProd?.quanLyHanSuDung ? (
                <div className="w-56">
                  <label className="block text-[11px] font-semibold text-amber-700 mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Hạn sử dụng: <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="date"
                    value={inputExpiry}
                    onChange={(e) => setInputExpiry(e.target.value)}
                    className="w-full px-3 py-1.5 border border-amber-300 bg-amber-50 rounded-xl text-xs"
                  />
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  Sản phẩm này không yêu cầu quản lý hạn sử dụng
                </span>
              )}

              <button
                type="button"
                onClick={handleAddLine}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm sản phẩm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table of items in current ticket */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Danh sách hàng nhập ({importLines.length})
            </h3>
            <div className="text-xs">
              Tổng tiền phiếu nhập:{' '}
              <strong className="text-emerald-700 font-bold text-sm">
                {formatVND(totalTicketAmount)}
              </strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4">Tên sản phẩm</th>
                  <th className="py-2.5 px-4 text-center">ĐVT nhập</th>
                  <th className="py-2.5 px-4 text-center">Tỷ lệ QĐ</th>
                  <th className="py-2.5 px-4 text-center">Số lượng</th>
                  <th className="py-2.5 px-4 text-right">Giá nhập</th>
                  <th className="py-2.5 px-4 text-right">Thành tiền</th>
                  <th className="py-2.5 px-4 text-center">Hạn sử dụng</th>
                  <th className="py-2.5 px-4 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {importLines.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Chưa có dòng sản phẩm nào trên phiếu nhập.
                    </td>
                  </tr>
                ) : (
                  importLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        {line.tenSanPham}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600">
                        {line.tenDonViNhap}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-500">
                        x{line.tyLeQuyDoi}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-800">
                        {line.soLuongNhap}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-600">
                        {formatVND(line.giaNhap)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-700">
                        {formatVND(line.thanhTien)}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {line.hanSuDung ? (
                          <span className="font-mono bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
                            {line.hanSuDung}
                          </span>
                        ) : (
                          <span className="text-slate-300">--</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => removeLine(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Action bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleSubmitTicket}
              disabled={loading || importLines.length === 0}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Đang lưu...' : 'Lưu phiếu nhập'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM CANCEL (UC4.1 2a.2) */}
      {showCancelPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800">
                Bạn có chắc chắn muốn hủy nhập hàng không?
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
                  setImportLines([]);
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
