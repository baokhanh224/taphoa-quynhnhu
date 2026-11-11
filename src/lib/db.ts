import prisma from './prisma';
import { generateSampleData, InitialData } from './sampleData';

// In-memory store for local fallback/mock if PostgreSQL is not available
class MemoryStore {
  data: InitialData;

  constructor() {
    this.data = generateSampleData();
  }

  reset() {
    this.data = generateSampleData();
  }
}

const globalForStore = globalThis as unknown as {
  memoryStore: MemoryStore | undefined;
  hasPostgres: boolean | undefined;
};

export const memoryStore = globalForStore.memoryStore ?? new MemoryStore();
if (process.env.NODE_ENV !== 'production') globalForStore.memoryStore = memoryStore;

// Check if PostgreSQL is available
export async function isPostgresAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost:5432')) {
    return false;
  }
  if (globalForStore.hasPostgres === true) {
    return true;
  }
  try {
    // Quick probe (handles Neon serverless cold start wakeup)
    await prisma.$queryRaw`SELECT 1`;
    globalForStore.hasPostgres = true;
    return true;
  } catch (err) {
    return false;
  }
}

// Reset sample data
export async function resetDatabase(): Promise<void> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const s = generateSampleData();
    await prisma.$transaction(async (tx) => {
      // Clear all in reverse dependency order
      await tx.idempotencyKey.deleteMany({});
      await tx.phanBoXuatKho.deleteMany({});
      await tx.chiTietDoiTra.deleteMany({});
      await tx.phieuDoiTra.deleteMany({});
      await tx.chiTietHoaDon.deleteMany({});
      await tx.hoaDon.deleteMany({});
      await tx.phieuDieuChinhTonKho.deleteMany({});
      await tx.chiTietNhapHang.deleteMany({});
      await tx.phieuNhapHang.deleteMany({});
      await tx.lichSuGiaBan.deleteMany({});
      await tx.donViQuyDoi.deleteMany({});
      await tx.sanPham.deleteMany({});
      await tx.danhMucSanPham.deleteMany({});
      await tx.nhaCungCap.deleteMany({});
      await tx.khachHang.deleteMany({});
      await tx.taiKhoan.deleteMany({});

      // Seed fresh
      for (const item of s.accounts) await tx.taiKhoan.create({ data: item });
      for (const item of s.categories) await tx.danhMucSanPham.create({ data: item });
      for (const item of s.suppliers) await tx.nhaCungCap.create({ data: item });
      for (const item of s.products) await tx.sanPham.create({ data: item });
      for (const item of s.units) await tx.donViQuyDoi.create({ data: item });
      for (const item of s.priceHistories) await tx.lichSuGiaBan.create({ data: item });
      for (const item of s.customers) await tx.khachHang.create({ data: item });
      for (const item of s.importTickets) await tx.phieuNhapHang.create({ data: item });
      for (const item of s.importDetails) await tx.chiTietNhapHang.create({ data: item });
      for (const item of s.invoices) await tx.hoaDon.create({ data: item });
      for (const item of s.invoiceDetails) await tx.chiTietHoaDon.create({ data: item });
      for (const item of s.allocations) await tx.phanBoXuatKho.create({ data: item });
      for (const item of s.exchangeReturns) await tx.phieuDoiTra.create({ data: item });
      for (const item of s.exchangeReturnDetails) await tx.chiTietDoiTra.create({ data: item });
    }, { maxWait: 10000, timeout: 30000 });
  } else {
    memoryStore.reset();
    (memoryStore.data as any).idempotency = [];
    (memoryStore.data as any).adjustments = [];
  }
}

// ==========================================
// CODE GENERATORS (SP0001, NCC001, KH0001, HD0001, PN0001, DC0001, DT0001)
// ==========================================
function maxNumericSuffix(codes: string[], prefix: string): number {
  let maxNum = 0;
  for (const code of codes) {
    if (!code.startsWith(prefix)) continue;
    const n = parseInt(code.slice(prefix.length), 10);
    if (!isNaN(n) && n > maxNum) maxNum = n;
  }
  return maxNum;
}

export async function getNextCodeNumber(
  prefix: string,
  txClient?: any,
  forcePg?: boolean
): Promise<number> {
  const usePg = forcePg !== undefined ? forcePg : await isPostgresAvailable();

  if (usePg) {
    const db = txClient || prisma;
    let codes: string[] = [];
    if (prefix === 'SP') {
      codes = (await db.sanPham.findMany({ select: { maSanPham: true } })).map((r: any) => r.maSanPham);
    } else if (prefix === 'NCC') {
      codes = (await db.nhaCungCap.findMany({ select: { maNhaCungCap: true } })).map((r: any) => r.maNhaCungCap);
    } else if (prefix === 'KH') {
      codes = (await db.khachHang.findMany({ select: { maKhachHang: true } })).map((r: any) => r.maKhachHang);
    } else if (prefix === 'HD') {
      codes = (await db.hoaDon.findMany({ select: { maHoaDon: true } })).map((r: any) => r.maHoaDon);
    } else if (prefix === 'PN') {
      codes = (await db.phieuNhapHang.findMany({ select: { maPhieuNhap: true } })).map((r: any) => r.maPhieuNhap);
    } else if (prefix === 'DC') {
      codes = (await db.phieuDieuChinhTonKho.findMany({ select: { maPhieuDieuChinh: true } })).map((r: any) => r.maPhieuDieuChinh);
    } else if (prefix === 'DT') {
      codes = (await db.phieuDoiTra.findMany({ select: { maPhieuDoiTra: true } })).map((r: any) => r.maPhieuDoiTra);
    } else if (prefix === 'DM') {
      codes = (await db.danhMucSanPham.findMany({ select: { maDanhMuc: true } })).map((r: any) => r.maDanhMuc);
    } else if (prefix === 'DV') {
      codes = (await db.donViQuyDoi.findMany({ select: { maDonVi: true } })).map((r: any) => r.maDonVi);
    } else if (prefix === 'LS') {
      codes = (await db.lichSuGiaBan.findMany({ select: { maLichSu: true } })).map((r: any) => r.maLichSu);
    } else if (prefix === 'CTN') {
      codes = (await db.chiTietNhapHang.findMany({ select: { maChiTietNhap: true } })).map((r: any) => r.maChiTietNhap);
    } else if (prefix === 'CTH') {
      codes = (await db.chiTietHoaDon.findMany({ select: { maChiTietHoaDon: true } })).map((r: any) => r.maChiTietHoaDon);
    } else if (prefix === 'PB') {
      codes = (await db.phanBoXuatKho.findMany({ select: { maPhanBo: true } })).map((r: any) => r.maPhanBo);
    } else if (prefix === 'CTD') {
      codes = (await db.chiTietDoiTra.findMany({ select: { maChiTiet: true } })).map((r: any) => r.maChiTiet);
    }
    return maxNumericSuffix(codes, prefix) + 1;
  }

  let items: string[] = [];
  if (prefix === 'SP') items = memoryStore.data.products.map((p) => p.maSanPham);
  else if (prefix === 'NCC') items = memoryStore.data.suppliers.map((s) => s.maNhaCungCap);
  else if (prefix === 'KH') items = memoryStore.data.customers.map((c) => c.maKhachHang);
  else if (prefix === 'HD') items = memoryStore.data.invoices.map((i) => i.maHoaDon);
  else if (prefix === 'PN') items = memoryStore.data.importTickets.map((t) => t.maPhieuNhap);
  else if (prefix === 'DC') items = (memoryStore.data as any).adjustments?.map((a: any) => a.maPhieuDieuChinh) || [];
  else if (prefix === 'DT') items = memoryStore.data.exchangeReturns.map((e) => e.maPhieuDoiTra);
  else if (prefix === 'DM') items = memoryStore.data.categories.map((c) => c.maDanhMuc);
  else if (prefix === 'DV') items = memoryStore.data.units.map((u) => u.maDonVi);
  else if (prefix === 'LS') items = memoryStore.data.priceHistories.map((h) => h.maLichSu);
  else if (prefix === 'CTN') items = memoryStore.data.importDetails.map((c) => c.maChiTietNhap);
  else if (prefix === 'CTH') items = memoryStore.data.invoiceDetails.map((c) => c.maChiTietHoaDon);
  else if (prefix === 'PB') items = memoryStore.data.allocations.map((a) => a.maPhanBo);
  else if (prefix === 'CTD') items = memoryStore.data.exchangeReturnDetails.map((c) => c.maChiTiet);

  return maxNumericSuffix(items, prefix) + 1;
}

export function formatCode(prefix: string, num: number, digits: number): string {
  return `${prefix}${String(num).padStart(digits, '0')}`;
}

export async function getNextCode(
  prefix: string,
  digits: number,
  txClient?: any,
  forcePg?: boolean
): Promise<string> {
  const nextNum = await getNextCodeNumber(prefix, txClient, forcePg);
  return formatCode(prefix, nextNum, digits);
}

// ==========================================
// USER ACCOUNTS
// ==========================================
export async function getAccountByUsername(username: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const count = await prisma.taiKhoan.count();
    if (count === 0) {
      // Tự động khởi tạo dữ liệu mẫu lần đầu nếu CSDL vừa mới đẩy schema
      await resetDatabase();
    }
    return prisma.taiKhoan.findUnique({ where: { tenDangNhap: username } });
  }
  return memoryStore.data.accounts.find((a) => a.tenDangNhap === username) || null;
}

// ==========================================
// CATEGORIES
// ==========================================
export async function getCategories() {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.danhMucSanPham.findMany({ orderBy: { maDanhMuc: 'asc' } });
  }
  return [...memoryStore.data.categories];
}

export async function createCategory(tenDanhMuc: string) {
  const usePg = await isPostgresAvailable();
  const maDanhMuc = await getNextCode('DM', 4, undefined, usePg);
  const record = { maDanhMuc, tenDanhMuc };

  if (usePg) {
    return prisma.danhMucSanPham.create({ data: record });
  }
  memoryStore.data.categories.push(record);
  return record;
}

// ==========================================
// PRODUCTS (UC 1.1 - 1.5)
// ==========================================
export async function getProducts(keyword?: string, categoryId?: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const where: any = {};
    if (categoryId) {
      where.maDanhMuc = categoryId;
    }
    if (keyword) {
      where.OR = [
        { maSanPham: { contains: keyword, mode: 'insensitive' } },
        { tenSanPham: { contains: keyword, mode: 'insensitive' } },
        { maVach: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    return prisma.sanPham.findMany({
      where,
      include: {
        danhMuc: true,
        donViQuyDois: true,
      },
      orderBy: { maSanPham: 'asc' },
    });
  }

  let list = memoryStore.data.products.map((p) => {
    const dm = memoryStore.data.categories.find((c) => c.maDanhMuc === p.maDanhMuc);
    const dvs = memoryStore.data.units.filter((u) => u.maSanPham === p.maSanPham);
    return {
      ...p,
      danhMuc: dm,
      donViQuyDois: dvs,
    };
  });

  if (categoryId) {
    list = list.filter((p) => p.maDanhMuc === categoryId);
  }
  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.maSanPham.toLowerCase().includes(kw) ||
        p.tenSanPham.toLowerCase().includes(kw) ||
        (p.maVach && p.maVach.toLowerCase().includes(kw))
    );
  }
  return list;
}

export async function getProductById(id: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.sanPham.findUnique({
      where: { maSanPham: id },
      include: {
        danhMuc: true,
        donViQuyDois: {
          include: {
            lichSuGia: { orderBy: { thoiDiemThayDoi: 'desc' } },
          },
        },
        chiTietNhaps: {
          include: { phieuNhap: true },
          orderBy: { hanSuDung: 'asc' },
        },
      },
    });
  }

  const p = memoryStore.data.products.find((prod) => prod.maSanPham === id);
  if (!p) return null;
  const dm = memoryStore.data.categories.find((c) => c.maDanhMuc === p.maDanhMuc);
  const dvs = memoryStore.data.units
    .filter((u) => u.maSanPham === p.maSanPham)
    .map((u) => {
      const ls = memoryStore.data.priceHistories.filter((h) => h.maDonVi === u.maDonVi);
      return { ...u, lichSuGia: ls };
    });
  const ctn = memoryStore.data.importDetails
    .filter((c) => c.maSanPham === p.maSanPham)
    .map((c) => {
      const pn = memoryStore.data.importTickets.find((t) => t.maPhieuNhap === c.maPhieuNhap);
      return { ...c, phieuNhap: pn };
    });

  return {
    ...p,
    danhMuc: dm,
    donViQuyDois: dvs,
    chiTietNhaps: ctn,
  };
}

export async function createProduct(payload: {
  tenSanPham: string;
  maDanhMuc: string;
  donViTinh: string;
  giaNhap: number;
  giaBan: number;
  maVach?: string;
  mucTonToiThieu?: number;
  quanLyHanSuDung?: boolean;
  moTa?: string;
  extraUnits?: Array<{ tenDonVi: string; heSoQuyDoi: number; giaBan: number }>;
}) {
  const usePg = await isPostgresAvailable();

  if (usePg) {
    return prisma.$transaction(async (tx) => {
      const maSanPham = await getNextCode('SP', 4, tx, true);
      let nextDvNum = await getNextCodeNumber('DV', tx, true);

      const productRecord = {
        maSanPham,
        tenSanPham: payload.tenSanPham,
        maDanhMuc: payload.maDanhMuc,
        maVach: payload.maVach || null,
        donViTinh: payload.donViTinh,
        giaNhapBinhQuan: payload.giaNhap,
        soLuongTon: 0,
        mucTonToiThieu: payload.mucTonToiThieu ?? 0,
        quanLyHanSuDung: Boolean(payload.quanLyHanSuDung),
        trangThai: 'Đang kinh doanh',
        moTa: payload.moTa || null,
      };

      const created = await tx.sanPham.create({ data: productRecord });
      const baseUnitCode = formatCode('DV', nextDvNum++, 4);
      await tx.donViQuyDoi.create({
        data: {
          maDonVi: baseUnitCode,
          maSanPham,
          tenDonVi: payload.donViTinh,
          heSoQuyDoi: 1,
          giaBan: payload.giaBan,
        },
      });
      if (payload.extraUnits && payload.extraUnits.length > 0) {
        for (const eu of payload.extraUnits) {
          const euCode = formatCode('DV', nextDvNum++, 4);
          await tx.donViQuyDoi.create({
            data: {
              maDonVi: euCode,
              maSanPham,
              tenDonVi: eu.tenDonVi,
              heSoQuyDoi: eu.heSoQuyDoi,
              giaBan: eu.giaBan,
            },
          });
        }
      }
      return created;
    });
  }

  // Memory store
  const maSanPham = await getNextCode('SP', 4, undefined, false);
  let nextDvNum = await getNextCodeNumber('DV', undefined, false);
  const productRecord = {
    maSanPham,
    tenSanPham: payload.tenSanPham,
    maDanhMuc: payload.maDanhMuc,
    maVach: payload.maVach || null,
    donViTinh: payload.donViTinh,
    giaNhapBinhQuan: payload.giaNhap,
    soLuongTon: 0,
    mucTonToiThieu: payload.mucTonToiThieu ?? 0,
    quanLyHanSuDung: Boolean(payload.quanLyHanSuDung),
    trangThai: 'Đang kinh doanh',
    moTa: payload.moTa || null,
  };

  memoryStore.data.products.push(productRecord);
  memoryStore.data.units.push({
    maDonVi: formatCode('DV', nextDvNum++, 4),
    maSanPham,
    tenDonVi: payload.donViTinh,
    heSoQuyDoi: 1,
    giaBan: payload.giaBan,
  });
  if (payload.extraUnits && payload.extraUnits.length > 0) {
    for (const eu of payload.extraUnits) {
      memoryStore.data.units.push({
        maDonVi: formatCode('DV', nextDvNum++, 4),
        maSanPham,
        tenDonVi: eu.tenDonVi,
        heSoQuyDoi: eu.heSoQuyDoi,
        giaBan: eu.giaBan,
      });
    }
  }
  return productRecord;
}

export async function updateProduct(
  id: string,
  payload: {
    tenSanPham: string;
    maDanhMuc: string;
    donViTinh: string;
    giaNhap: number;
    maVach?: string;
    mucTonToiThieu?: number;
    quanLyHanSuDung?: boolean;
    moTa?: string;
    trangThai?: string;
  }
) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.sanPham.update({
      where: { maSanPham: id },
      data: {
        tenSanPham: payload.tenSanPham,
        maDanhMuc: payload.maDanhMuc,
        donViTinh: payload.donViTinh,
        giaNhapBinhQuan: payload.giaNhap,
        maVach: payload.maVach || null,
        mucTonToiThieu: payload.mucTonToiThieu ?? 0,
        quanLyHanSuDung: Boolean(payload.quanLyHanSuDung),
        moTa: payload.moTa || null,
        ...(payload.trangThai ? { trangThai: payload.trangThai } : {}),
      },
    });
  }

  const idx = memoryStore.data.products.findIndex((p) => p.maSanPham === id);
  if (idx === -1) return null;
  const current = memoryStore.data.products[idx];
  memoryStore.data.products[idx] = {
    ...current,
    tenSanPham: payload.tenSanPham,
    maDanhMuc: payload.maDanhMuc,
    donViTinh: payload.donViTinh,
    giaNhapBinhQuan: payload.giaNhap,
    maVach: payload.maVach || null,
    mucTonToiThieu: payload.mucTonToiThieu ?? 0,
    quanLyHanSuDung: Boolean(payload.quanLyHanSuDung),
    moTa: payload.moTa || null,
    ...(payload.trangThai ? { trangThai: payload.trangThai } : {}),
  };
  return memoryStore.data.products[idx];
}

export async function checkProductCanBeDeleted(id: string): Promise<boolean> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const prod = await prisma.sanPham.findUnique({
      where: { maSanPham: id },
      include: {
        chiTietNhaps: true,
        chiTietHoaDons: true,
        chiTietDoiTras: true,
      },
    });
    if (!prod) return false;
    if (prod.soLuongTon > 0) return false;
    if (
      prod.chiTietNhaps.length > 0 ||
      prod.chiTietHoaDons.length > 0 ||
      prod.chiTietDoiTras.length > 0
    ) {
      return false;
    }
    return true;
  }

  const prod = memoryStore.data.products.find((p) => p.maSanPham === id);
  if (!prod) return false;
  if (prod.soLuongTon > 0) return false;
  const hasImport = memoryStore.data.importDetails.some((c) => c.maSanPham === id);
  const hasSale = memoryStore.data.invoiceDetails.some((c) => c.maSanPham === id);
  const hasReturn = memoryStore.data.exchangeReturnDetails.some((c) => c.maSanPham === id);
  if (hasImport || hasSale || hasReturn) return false;
  return true;
}

export async function deleteProduct(id: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.$transaction(async (tx) => {
      await tx.donViQuyDoi.deleteMany({ where: { maSanPham: id } });
      return tx.sanPham.delete({ where: { maSanPham: id } });
    });
  }

  const idx = memoryStore.data.products.findIndex((p) => p.maSanPham === id);
  if (idx !== -1) {
    memoryStore.data.products.splice(idx, 1);
    memoryStore.data.units = memoryStore.data.units.filter((u) => u.maSanPham !== id);
    return true;
  }
  return false;
}

export async function updateProductPrice(
  maDonVi: string,
  giaMoi: number
): Promise<{ success: boolean; error?: string }> {
  const usePg = await isPostgresAvailable();

  if (usePg) {
    return prisma.$transaction(async (tx) => {
      const unit = await tx.donViQuyDoi.findUnique({ where: { maDonVi } });
      if (!unit) return { success: false, error: 'Đơn vị không tồn tại' };

      const nextLsCode = await getNextCode('LS', 4, tx, true);
      await tx.lichSuGiaBan.create({
        data: {
          maLichSu: nextLsCode,
          maDonVi,
          giaCu: unit.giaBan,
          giaMoi,
          thoiDiemThayDoi: new Date(),
        },
      });
      await tx.donViQuyDoi.update({
        where: { maDonVi },
        data: { giaBan: giaMoi },
      });
      return { success: true };
    });
  }

  const unit = memoryStore.data.units.find((u) => u.maDonVi === maDonVi);
  if (!unit) return { success: false, error: 'Đơn vị không tồn tại' };

  const nextLsCode = await getNextCode('LS', 4, undefined, false);
  const giaCu = unit.giaBan;
  unit.giaBan = giaMoi;
  memoryStore.data.priceHistories.push({
    maLichSu: nextLsCode,
    maDonVi,
    giaCu,
    giaMoi,
    thoiDiemThayDoi: new Date(),
  });
  return { success: true };
}

// ==========================================
// SUPPLIERS (UC 2.1 - 2.4)
// ==========================================
export async function getSuppliers(keyword?: string, category?: string, status?: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const where: any = {};
    if (category) where.danhMuc = category;
    if (status) where.trangThai = status;
    if (keyword) {
      where.OR = [
        { maNhaCungCap: { contains: keyword, mode: 'insensitive' } },
        { tenNhaCungCap: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    return prisma.nhaCungCap.findMany({ where, orderBy: { maNhaCungCap: 'asc' } });
  }

  let list = [...memoryStore.data.suppliers];
  if (category) list = list.filter((s) => s.danhMuc === category);
  if (status) list = list.filter((s) => s.trangThai === status);
  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.maNhaCungCap.toLowerCase().includes(kw) ||
        s.tenNhaCungCap.toLowerCase().includes(kw)
    );
  }
  return list;
}

export async function getSupplierById(id: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.nhaCungCap.findUnique({
      where: { maNhaCungCap: id },
      include: { phieuNhaps: true },
    });
  }
  const s = memoryStore.data.suppliers.find((sup) => sup.maNhaCungCap === id);
  if (!s) return null;
  const pns = memoryStore.data.importTickets.filter((t) => t.maNhaCungCap === id);
  return { ...s, phieuNhaps: pns };
}

export async function createSupplier(payload: {
  tenNhaCungCap: string;
  soDienThoai: string;
  email?: string;
  diaChi?: string;
  danhMuc?: string;
  moTa?: string;
}) {
  const maNhaCungCap = await getNextCode('NCC', 3);
  const record = {
    maNhaCungCap,
    tenNhaCungCap: payload.tenNhaCungCap,
    soDienThoai: payload.soDienThoai,
    email: payload.email || null,
    diaChi: payload.diaChi || null,
    danhMuc: payload.danhMuc || null,
    trangThai: 'Đang hợp tác',
    moTa: payload.moTa || null,
  };

  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.nhaCungCap.create({ data: record });
  }
  memoryStore.data.suppliers.push(record);
  return record;
}

export async function updateSupplier(
  id: string,
  payload: {
    tenNhaCungCap: string;
    soDienThoai: string;
    email?: string;
    diaChi?: string;
    danhMuc?: string;
    moTa?: string;
    trangThai: string;
  }
) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.nhaCungCap.update({
      where: { maNhaCungCap: id },
      data: {
        tenNhaCungCap: payload.tenNhaCungCap,
        soDienThoai: payload.soDienThoai,
        email: payload.email || null,
        diaChi: payload.diaChi || null,
        danhMuc: payload.danhMuc || null,
        moTa: payload.moTa || null,
        trangThai: payload.trangThai,
      },
    });
  }

  const idx = memoryStore.data.suppliers.findIndex((s) => s.maNhaCungCap === id);
  if (idx === -1) return null;
  memoryStore.data.suppliers[idx] = {
    ...memoryStore.data.suppliers[idx],
    tenNhaCungCap: payload.tenNhaCungCap,
    soDienThoai: payload.soDienThoai,
    email: payload.email || null,
    diaChi: payload.diaChi || null,
    danhMuc: payload.danhMuc || null,
    moTa: payload.moTa || null,
    trangThai: payload.trangThai,
  };
  return memoryStore.data.suppliers[idx];
}

export async function checkSupplierHasImports(id: string): Promise<boolean> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const count = await prisma.phieuNhapHang.count({ where: { maNhaCungCap: id } });
    return count > 0;
  }
  return memoryStore.data.importTickets.some((t) => t.maNhaCungCap === id);
}

export async function deleteSupplier(id: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.nhaCungCap.delete({ where: { maNhaCungCap: id } });
  }
  const idx = memoryStore.data.suppliers.findIndex((s) => s.maNhaCungCap === id);
  if (idx !== -1) {
    memoryStore.data.suppliers.splice(idx, 1);
    return true;
  }
  return false;
}

// ==========================================
// CUSTOMERS (UC 5.1 - 5.4)
// ==========================================
export async function getCustomers(keyword?: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const where: any = {};
    if (keyword) {
      where.OR = [
        { maKhachHang: { contains: keyword, mode: 'insensitive' } },
        { tenKhachHang: { contains: keyword, mode: 'insensitive' } },
        { soDienThoai: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    return prisma.khachHang.findMany({
      where,
      include: {
        hoaDons: {
          orderBy: { ngayGioBan: 'desc' },
        },
      },
      orderBy: { maKhachHang: 'asc' },
    });
  }

  let list = memoryStore.data.customers.map((c) => {
    const hds = memoryStore.data.invoices
      .filter((i) => i.maKhachHang === c.maKhachHang)
      .sort((a, b) => new Date(b.ngayGioBan).getTime() - new Date(a.ngayGioBan).getTime());
    return { ...c, hoaDons: hds };
  });

  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.maKhachHang.toLowerCase().includes(kw) ||
        c.tenKhachHang.toLowerCase().includes(kw) ||
        c.soDienThoai.toLowerCase().includes(kw)
    );
  }
  return list;
}

export async function getCustomerByPhone(phone: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.khachHang.findUnique({
      where: { soDienThoai: phone },
      include: {
        hoaDons: { orderBy: { ngayGioBan: 'desc' } },
      },
    });
  }
  const c = memoryStore.data.customers.find((cust) => cust.soDienThoai === phone);
  if (!c) return null;
  const hds = memoryStore.data.invoices.filter((i) => i.maKhachHang === c.maKhachHang);
  return { ...c, hoaDons: hds };
}

export async function createCustomer(payload: {
  tenKhachHang: string;
  soDienThoai: string;
  diaChi?: string;
}) {
  const maKhachHang = await getNextCode('KH', 4);
  const record = {
    maKhachHang,
    tenKhachHang: payload.tenKhachHang,
    soDienThoai: payload.soDienThoai,
    diaChi: payload.diaChi || null,
  };

  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.khachHang.create({ data: record });
  }
  memoryStore.data.customers.push(record);
  return record;
}

export async function updateCustomer(
  id: string,
  payload: {
    tenKhachHang: string;
    soDienThoai: string;
    diaChi?: string;
  }
) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.khachHang.update({
      where: { maKhachHang: id },
      data: {
        tenKhachHang: payload.tenKhachHang,
        soDienThoai: payload.soDienThoai,
        diaChi: payload.diaChi || null,
      },
    });
  }

  const idx = memoryStore.data.customers.findIndex((c) => c.maKhachHang === id);
  if (idx === -1) return null;
  memoryStore.data.customers[idx] = {
    ...memoryStore.data.customers[idx],
    tenKhachHang: payload.tenKhachHang,
    soDienThoai: payload.soDienThoai,
    diaChi: payload.diaChi || null,
  };
  return memoryStore.data.customers[idx];
}

export async function checkCustomerHasInvoices(id: string): Promise<boolean> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const count = await prisma.hoaDon.count({ where: { maKhachHang: id } });
    return count > 0;
  }
  return memoryStore.data.invoices.some((i) => i.maKhachHang === id);
}

export async function deleteCustomer(id: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.khachHang.delete({ where: { maKhachHang: id } });
  }
  const idx = memoryStore.data.customers.findIndex((c) => c.maKhachHang === id);
  if (idx !== -1) {
    memoryStore.data.customers.splice(idx, 1);
    return true;
  }
  return false;
}

// ==========================================
// INVENTORY & IMPORT (UC 4.1, 4.2, 4.3, 4.4)
// ==========================================
export async function createImportTicket(payload: {
  maNhaCungCap: string;
  items: Array<{
    maSanPham: string;
    maDonViNhap: string;
    soLuongNhap: number;
    giaNhap: number;
    hanSuDung?: string | null;
  }>;
}) {
  const usePg = await isPostgresAvailable();
  const now = new Date();

  let tongTien = 0;
  for (let i = 0; i < payload.items.length; i++) {
    const it = payload.items[i];
    tongTien += it.soLuongNhap * it.giaNhap;
  }

  if (usePg) {
    return prisma.$transaction(async (tx) => {
      // Lock product rows in sorted order to serialize concurrent cost/stock updates
      const prodIds = Array.from(new Set(payload.items.map((i) => i.maSanPham))).sort();
      for (const pid of prodIds) {
        await tx.$queryRaw`SELECT "maSanPham" FROM "SanPham" WHERE "maSanPham" = ${pid} FOR UPDATE`;
      }

      const maPhieuNhap = await getNextCode('PN', 4, tx, true);
      let nextCtnNum = await getNextCodeNumber('CTN', tx, true);

      const ticket = await tx.phieuNhapHang.create({
        data: {
          maPhieuNhap,
          maNhaCungCap: payload.maNhaCungCap,
          ngayNhap: now,
          tongTien,
        },
      });

      for (let i = 0; i < payload.items.length; i++) {
        const it = payload.items[i];
        const maChiTietNhap = formatCode('CTN', nextCtnNum++, 4);
        const unit = await tx.donViQuyDoi.findUnique({ where: { maDonVi: it.maDonViNhap } });
        const tyLeQuyDoi = unit?.heSoQuyDoi || 1;
        const baseQty = it.soLuongNhap * tyLeQuyDoi;
        const thanhTien = it.soLuongNhap * it.giaNhap;

        await tx.chiTietNhapHang.create({
          data: {
            maChiTietNhap,
            maPhieuNhap,
            maSanPham: it.maSanPham,
            maDonViNhap: it.maDonViNhap,
            tyLeQuyDoi,
            soLuongNhap: it.soLuongNhap,
            soLuongCon: baseQty,
            giaNhap: it.giaNhap,
            thanhTien,
            hanSuDung: it.hanSuDung ? new Date(it.hanSuDung) : null,
          },
        });

        // BR-UC4-04: Cập nhật tồn kho và tính lại giá nhập bình quân
        const product = await tx.sanPham.findUnique({ where: { maSanPham: it.maSanPham } });
        if (product) {
          const oldStock = product.soLuongTon;
          const oldPrice = Number(product.giaNhapBinhQuan);
          const newStock = oldStock + baseQty;
          const costOfNewBase = it.giaNhap / tyLeQuyDoi;
          const newAvg =
            newStock > 0 ? (oldStock * oldPrice + baseQty * costOfNewBase) / newStock : costOfNewBase;

          await tx.sanPham.update({
            where: { maSanPham: it.maSanPham },
            data: {
              soLuongTon: newStock,
              giaNhapBinhQuan: Math.round(newAvg),
            },
          });
        }
      }

      return ticket;
    });
  }

  // Memory store
  const maPhieuNhap = await getNextCode('PN', 4, undefined, false);
  let nextCtnNum = await getNextCodeNumber('CTN', undefined, false);
  const ticketRecord = {
    maPhieuNhap,
    maNhaCungCap: payload.maNhaCungCap,
    ngayNhap: now,
    tongTien,
  };
  memoryStore.data.importTickets.push(ticketRecord);

  for (const it of payload.items) {
    const maChiTietNhap = formatCode('CTN', nextCtnNum++, 4);
    const unit = memoryStore.data.units.find((u) => u.maDonVi === it.maDonViNhap);
    const tyLeQuyDoi = unit?.heSoQuyDoi || 1;
    const baseQty = it.soLuongNhap * tyLeQuyDoi;
    const thanhTien = it.soLuongNhap * it.giaNhap;

    const detailRecord = {
      maChiTietNhap,
      maPhieuNhap,
      maSanPham: it.maSanPham,
      maDonViNhap: it.maDonViNhap,
      tyLeQuyDoi,
      soLuongNhap: it.soLuongNhap,
      soLuongCon: baseQty,
      giaNhap: it.giaNhap,
      thanhTien,
      hanSuDung: it.hanSuDung ? new Date(it.hanSuDung) : null,
    };
    memoryStore.data.importDetails.push(detailRecord);

    // Update product stock and weighted average cost
    const prod = memoryStore.data.products.find((p) => p.maSanPham === it.maSanPham);
    if (prod) {
      const oldStock = prod.soLuongTon;
      const oldPrice = prod.giaNhapBinhQuan;
      const newStock = oldStock + baseQty;
      const costOfNewBase = it.giaNhap / tyLeQuyDoi;
      const newAvg =
        newStock > 0 ? (oldStock * oldPrice + baseQty * costOfNewBase) / newStock : costOfNewBase;
      prod.soLuongTon = newStock;
      prod.giaNhapBinhQuan = Math.round(newAvg);
    }
  }

  return ticketRecord;
}

export async function adjustInventory(payload: {
  maSanPham: string;
  maChiTietNhap: string;
  soLuongMoi: number;
  lyDo: string;
}) {
  const usePg = await isPostgresAvailable();
  const now = new Date();

  if (usePg) {
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "maSanPham" FROM "SanPham" WHERE "maSanPham" = ${payload.maSanPham} FOR UPDATE`;
      const lot = await tx.chiTietNhapHang.findUnique({
        where: { maChiTietNhap: payload.maChiTietNhap },
      });
      if (!lot) throw new Error('Chi tiết phiếu nhập không tồn tại');

      const maPhieuDieuChinh = await getNextCode('DC', 4, tx, true);
      const soLuongCu = lot.soLuongCon;
      const chenhLech = payload.soLuongMoi - soLuongCu;

      // Update lot remaining stock
      await tx.chiTietNhapHang.update({
        where: { maChiTietNhap: payload.maChiTietNhap },
        data: { soLuongCon: payload.soLuongMoi },
      });

      // Update product total stock
      await tx.sanPham.update({
        where: { maSanPham: payload.maSanPham },
        data: {
          soLuongTon: { increment: chenhLech },
        },
      });

      return tx.phieuDieuChinhTonKho.create({
        data: {
          maPhieuDieuChinh,
          maSanPham: payload.maSanPham,
          maChiTietNhap: payload.maChiTietNhap,
          ngayDieuChinh: now,
          soLuongCu,
          soLuongMoi: payload.soLuongMoi,
          lyDo: payload.lyDo,
          chenhLech,
        },
      });
    });
  }

  // Memory store
  const maPhieuDieuChinh = await getNextCode('DC', 4, undefined, false);
  const lot = memoryStore.data.importDetails.find(
    (c) => c.maChiTietNhap === payload.maChiTietNhap
  );
  if (!lot) throw new Error('Chi tiết phiếu nhập không tồn tại');

  const soLuongCu = lot.soLuongCon;
  const chenhLech = payload.soLuongMoi - soLuongCu;
  lot.soLuongCon = payload.soLuongMoi;

  const prod = memoryStore.data.products.find((p) => p.maSanPham === payload.maSanPham);
  if (prod) {
    prod.soLuongTon += chenhLech;
  }

  const adjRecord = {
    maPhieuDieuChinh,
    maSanPham: payload.maSanPham,
    maChiTietNhap: payload.maChiTietNhap,
    ngayDieuChinh: now,
    soLuongCu,
    soLuongMoi: payload.soLuongMoi,
    lyDo: payload.lyDo,
    chenhLech,
  };
  if (!(memoryStore.data as any).adjustments) {
    (memoryStore.data as any).adjustments = [];
  }
  (memoryStore.data as any).adjustments.push(adjRecord);
  return adjRecord;
}

export async function getInventoryInquiry(filter: 'all' | 'low_stock' | 'near_expiry' | 'expired', keyword?: string) {
  const usePg = await isPostgresAvailable();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysLater = new Date(today.getTime() + 30 * 86400000);

  if (usePg) {
    const products = await prisma.sanPham.findMany({
      include: {
        danhMuc: true,
        donViQuyDois: true,
        chiTietNhaps: {
          include: { phieuNhap: true },
          orderBy: { hanSuDung: 'asc' },
        },
      },
      orderBy: { maSanPham: 'asc' },
    });

    return formatInquiryResults(products, filter, keyword, today, thirtyDaysLater);
  }

  const products = memoryStore.data.products.map((p) => {
    const dm = memoryStore.data.categories.find((c) => c.maDanhMuc === p.maDanhMuc);
    const dvs = memoryStore.data.units.filter((u) => u.maSanPham === p.maSanPham);
    const ctn = memoryStore.data.importDetails
      .filter((c) => c.maSanPham === p.maSanPham)
      .map((c) => {
        const pn = memoryStore.data.importTickets.find((t) => t.maPhieuNhap === c.maPhieuNhap);
        return { ...c, phieuNhap: pn };
      });
    return { ...p, danhMuc: dm, donViQuyDois: dvs, chiTietNhaps: ctn };
  });

  return formatInquiryResults(products, filter, keyword, today, thirtyDaysLater);
}

function formatInquiryResults(
  products: any[],
  filter: 'all' | 'low_stock' | 'near_expiry' | 'expired',
  keyword: string | undefined,
  today: Date,
  thirtyDaysLater: Date
) {
  let list = products;
  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.maSanPham.toLowerCase().includes(kw) ||
        p.tenSanPham.toLowerCase().includes(kw) ||
        (p.maVach && p.maVach.toLowerCase().includes(kw))
    );
  }

  const results: any[] = [];

  for (const p of list) {
    const isLowStock = p.soLuongTon <= p.mucTonToiThieu;
    const remainingLots = (p.chiTietNhaps || []).filter((lot: any) => lot.soLuongCon > 0);

    const expiredLots = remainingLots.filter((lot: any) => {
      if (!lot.hanSuDung) return false;
      const exp = new Date(lot.hanSuDung);
      return exp < today;
    });

    const nearExpiryLots = remainingLots.filter((lot: any) => {
      if (!lot.hanSuDung) return false;
      const exp = new Date(lot.hanSuDung);
      return exp >= today && exp <= thirtyDaysLater;
    });

    if (filter === 'low_stock') {
      if (isLowStock) {
        results.push({
          maSanPham: p.maSanPham,
          tenSanPham: p.tenSanPham,
          donViTinh: p.donViTinh,
          soLuongTon: p.soLuongTon,
          mucTonToiThieu: p.mucTonToiThieu,
          trangThai: 'Dưới mức cảnh báo tồn kho',
          chiTiet: remainingLots,
        });
      }
    } else if (filter === 'expired') {
      if (expiredLots.length > 0) {
        for (const lot of expiredLots) {
          results.push({
            maSanPham: p.maSanPham,
            tenSanPham: p.tenSanPham,
            donViTinh: p.donViTinh,
            soLuongTon: p.soLuongTon,
            maPhieuNhap: lot.maPhieuNhap,
            maChiTietNhap: lot.maChiTietNhap,
            hanSuDung: lot.hanSuDung,
            soLuongCon: lot.soLuongCon,
            trangThai: 'Đã hết hạn',
          });
        }
      }
    } else if (filter === 'near_expiry') {
      if (nearExpiryLots.length > 0) {
        for (const lot of nearExpiryLots) {
          results.push({
            maSanPham: p.maSanPham,
            tenSanPham: p.tenSanPham,
            donViTinh: p.donViTinh,
            soLuongTon: p.soLuongTon,
            maPhieuNhap: lot.maPhieuNhap,
            maChiTietNhap: lot.maChiTietNhap,
            hanSuDung: lot.hanSuDung,
            soLuongCon: lot.soLuongCon,
            trangThai: 'Sắp hết hạn',
          });
        }
      }
    } else {
      // 'all'
      let status = 'Bình thường';
      if (isLowStock) status = 'Dưới mức cảnh báo tồn kho';
      else if (expiredLots.length > 0) status = 'Đã hết hạn';
      else if (nearExpiryLots.length > 0) status = 'Sắp hết hạn';

      results.push({
        maSanPham: p.maSanPham,
        tenSanPham: p.tenSanPham,
        donViTinh: p.donViTinh,
        soLuongTon: p.soLuongTon,
        mucTonToiThieu: p.mucTonToiThieu,
        trangThai: status,
        chiTiet: remainingLots,
      });
    }
  }

  return results;
}

export async function getImportHistory(keyword?: string, fromDate?: string, toDate?: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const where: any = {};
    if (keyword) {
      where.OR = [
        { maPhieuNhap: { contains: keyword, mode: 'insensitive' } },
        { nhaCungCap: { tenNhaCungCap: { contains: keyword, mode: 'insensitive' } } },
      ];
    }
    if (fromDate || toDate) {
      where.ngayNhap = {};
      if (fromDate) where.ngayNhap.gte = new Date(fromDate);
      if (toDate) {
        const toD = new Date(toDate);
        toD.setHours(23, 59, 59, 999);
        where.ngayNhap.lte = toD;
      }
    }
    return prisma.phieuNhapHang.findMany({
      where,
      include: {
        nhaCungCap: true,
        chiTietNhaps: {
          include: {
            sanPham: true,
            donViNhap: true,
          },
        },
      },
      orderBy: { ngayNhap: 'desc' },
    });
  }

  let list = memoryStore.data.importTickets.map((t) => {
    const ncc = memoryStore.data.suppliers.find((s) => s.maNhaCungCap === t.maNhaCungCap);
    const details = memoryStore.data.importDetails
      .filter((d) => d.maPhieuNhap === t.maPhieuNhap)
      .map((d) => {
        const prod = memoryStore.data.products.find((p) => p.maSanPham === d.maSanPham);
        const unit = memoryStore.data.units.find((u) => u.maDonVi === d.maDonViNhap);
        return { ...d, sanPham: prod, donViNhap: unit };
      });
    return { ...t, nhaCungCap: ncc, chiTietNhaps: details };
  });

  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.maPhieuNhap.toLowerCase().includes(kw) ||
        (t.nhaCungCap && t.nhaCungCap.tenNhaCungCap.toLowerCase().includes(kw))
    );
  }
  if (fromDate) {
    const f = new Date(fromDate).getTime();
    list = list.filter((t) => new Date(t.ngayNhap).getTime() >= f);
  }
  if (toDate) {
    const toD = new Date(toDate);
    toD.setHours(23, 59, 59, 999);
    list = list.filter((t) => new Date(t.ngayNhap).getTime() <= toD.getTime());
  }

  return list.sort((a, b) => new Date(b.ngayNhap).getTime() - new Date(a.ngayNhap).getTime());
}

// ==========================================
// SALES & POS (UC 6.1 - 6.5)
// ==========================================

// Inventory allocation order: FEFO for expirable items, FIFO for non-expirable items.
function sortLotsFEFO<T extends { hanSuDung?: Date | string | null; phieuNhap?: { ngayNhap?: Date | string | null } | null; maChiTietNhap: string }>(lots: T[]): T[] {
  return [...lots].sort((a, b) => {
    // FEFO first: items with expiry date sorted ascending
    if (a.hanSuDung && b.hanSuDung) {
      const diff = new Date(a.hanSuDung).getTime() - new Date(b.hanSuDung).getTime();
      if (diff !== 0) return diff;
    } else {
      if (a.hanSuDung && !b.hanSuDung) return -1;
      if (!a.hanSuDung && b.hanSuDung) return 1;
    }
    // Same expiry or non-expirable: FIFO by import date
    const dateA = a.phieuNhap?.ngayNhap ? new Date(a.phieuNhap.ngayNhap).getTime() : 0;
    const dateB = b.phieuNhap?.ngayNhap ? new Date(b.phieuNhap.ngayNhap).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return a.maChiTietNhap.localeCompare(b.maChiTietNhap);
  });
}

// Expired lots (hanSuDung < today) are NOT sellable.
export async function getSellableInventoryLots(maSanPham: string) {
  const usePg = await isPostgresAvailable();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (usePg) {
    const lots = await prisma.chiTietNhapHang.findMany({
      where: {
        maSanPham,
        soLuongCon: { gt: 0 },
        OR: [{ hanSuDung: null }, { hanSuDung: { gte: today } }],
      },
      include: { phieuNhap: true },
    });
    return sortLotsFEFO(lots);
  }

  const memLots = memoryStore.data.importDetails
    .filter((lot) => {
      if (lot.maSanPham !== maSanPham || lot.soLuongCon <= 0) return false;
      if (lot.hanSuDung && new Date(lot.hanSuDung) < today) return false;
      return true;
    })
    .map((lot) => {
      const pn = memoryStore.data.importTickets.find((t) => t.maPhieuNhap === lot.maPhieuNhap);
      return { ...lot, phieuNhap: pn };
    });
  return sortLotsFEFO(memLots);
}

export async function createSaleTransaction(payload: {
  maKhachHang?: string | null;
  phuongThucThanhToan: 'Tiền mặt' | 'Chuyển khoản';
  tienKhachDua?: number;
  tienThua?: number;
  idempotencyKey?: string;
  items: Array<{
    maSanPham: string;
    maDonViBan: string;
    soLuong: number;
    donGia: number;
    thanhTien: number;
  }>;
}) {
  const usePg = await isPostgresAvailable();
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tongTien = 0;
  for (const it of payload.items) {
    const unitId = it.maDonViBan || (it as any).maDonVi;
    it.maDonViBan = unitId;
    if (it.thanhTien === undefined || isNaN(it.thanhTien)) {
      it.thanhTien = Number(it.soLuong) * Number(it.donGia);
    }
    tongTien += Number(it.thanhTien);
  }

  if (usePg) {
    return prisma.$transaction(async (tx) => {
      // 1. Idempotency check
      if (payload.idempotencyKey) {
        const existing = await tx.idempotencyKey.findUnique({
          where: { key: payload.idempotencyKey },
        });
        if (existing && existing.response) {
          return JSON.parse(existing.response);
        }
      }

      // 2. Lock product rows in sorted order to prevent concurrent negative stock / double deduction
      const productIds = Array.from(new Set(payload.items.map((it) => it.maSanPham))).sort();
      for (const pid of productIds) {
        await tx.$executeRaw`SELECT "maSanPham" FROM "SanPham" WHERE "maSanPham" = ${pid} FOR UPDATE`;
      }

      const maHoaDon = await getNextCode('HD', 4, tx, true);
      let nextCthNum = await getNextCodeNumber('CTH', tx, true);
      let nextPbNum = await getNextCodeNumber('PB', tx, true);

      // 3. Check & allocate inventory for each item
      const allocationsToCreate: any[] = [];
      const invoiceDetailsToCreate: any[] = [];
      const warningLowStockProducts: string[] = [];

      for (const it of payload.items) {
        const unit = await tx.donViQuyDoi.findUnique({ where: { maDonVi: it.maDonViBan } });
        const tyLe = unit?.heSoQuyDoi || 1;
        const totalBaseNeeded = it.soLuong * tyLe;

        // Fetch sellable lots with deterministic FEFO -> FIFO sorting
        const rawLots = await tx.chiTietNhapHang.findMany({
          where: {
            maSanPham: it.maSanPham,
            soLuongCon: { gt: 0 },
            OR: [{ hanSuDung: null }, { hanSuDung: { gte: today } }],
          },
          include: { phieuNhap: true },
        });
        const lots = sortLotsFEFO(rawLots);

        const totalAvailable = lots.reduce((acc, l) => acc + l.soLuongCon, 0);
        if (totalAvailable < totalBaseNeeded) {
          throw new Error('Không đủ số lượng hàng có thể bán');
        }

        // Allocate FEFO / FIFO
        let needed = totalBaseNeeded;
        const cthId = formatCode('CTH', nextCthNum++, 4);
        const prod = await tx.sanPham.findUnique({ where: { maSanPham: it.maSanPham } });
        const giaVon = Number(prod?.giaNhapBinhQuan || 0);

        invoiceDetailsToCreate.push({
          maChiTietHoaDon: cthId,
          maHoaDon,
          maSanPham: it.maSanPham,
          maDonViBan: it.maDonViBan,
          tyLeQuyDoi: tyLe,
          soLuong: it.soLuong,
          donGia: it.donGia,
          giaVonBinhQuan: giaVon,
          thanhTien: it.thanhTien,
        });

        for (const lot of lots) {
          if (needed <= 0) break;
          const take = Math.min(lot.soLuongCon, needed);
          needed -= take;

          // Deduct from lot
          await tx.chiTietNhapHang.update({
            where: { maChiTietNhap: lot.maChiTietNhap },
            data: { soLuongCon: lot.soLuongCon - take },
          });

          const pbId = formatCode('PB', nextPbNum++, 4);
          allocationsToCreate.push({
            maPhanBo: pbId,
            maChiTietNhap: lot.maChiTietNhap,
            maChiTietHoaDon: cthId,
            soLuongXuat: take,
          });
        }

        // Deduct from product stock
        const updatedProd = await tx.sanPham.update({
          where: { maSanPham: it.maSanPham },
          data: { soLuongTon: { decrement: totalBaseNeeded } },
        });

        // BR-UC6-08: Check low stock warning
        if (updatedProd.soLuongTon <= updatedProd.mucTonToiThieu && !warningLowStockProducts.includes(updatedProd.tenSanPham)) {
          warningLowStockProducts.push(updatedProd.tenSanPham);
        }
      }

      // Create invoice
      const invoice = await tx.hoaDon.create({
        data: {
          maHoaDon,
          maKhachHang: payload.maKhachHang || null,
          ngayGioBan: now,
          tongTien,
          phuongThucThanhToan: payload.phuongThucThanhToan,
          tienKhachDua: payload.tienKhachDua ?? null,
          tienThua: payload.tienThua ?? null,
          trangThai: 'Đã thanh toán',
        },
      });

      // Create invoice details & allocations
      for (const d of invoiceDetailsToCreate) {
        await tx.chiTietHoaDon.create({ data: d });
      }
      for (const a of allocationsToCreate) {
        await tx.phanBoXuatKho.create({ data: a });
      }

      const responseData = {
        invoice,
        warningLowStockProducts,
      };

      if (payload.idempotencyKey) {
        await tx.idempotencyKey.create({
          data: {
            key: payload.idempotencyKey,
            action: 'CREATE_SALE',
            response: JSON.stringify(responseData),
          },
        });
      }

      return responseData;
    });
  }

  // Memory store execution
  if (payload.idempotencyKey) {
    const existing = (memoryStore.data as any).idempotency?.find(
      (k: any) => k.key === payload.idempotencyKey
    );
    if (existing && existing.response) {
      return JSON.parse(existing.response);
    }
  }

  const maHoaDon = await getNextCode('HD', 4);
  let nextCthNum = await getNextCodeNumber('CTH');
  let nextPbNum = await getNextCodeNumber('PB');

  const invoiceDetailsToCreate: any[] = [];
  const allocationsToCreate: any[] = [];
  const warningLowStockProducts: string[] = [];
  const plannedLotDeductions = new Map<string, number>();
  const plannedProdDeductions = new Map<string, number>();

  for (const it of payload.items) {
    const unit = memoryStore.data.units.find((u) => u.maDonVi === it.maDonViBan);
    const tyLe = unit?.heSoQuyDoi || 1;
    const totalBaseNeeded = it.soLuong * tyLe;

    const rawLots = await getSellableInventoryLots(it.maSanPham);
    const lotsWithRemaining = rawLots
      .map((l) => ({
        ...l,
        soLuongCon: l.soLuongCon - (plannedLotDeductions.get(l.maChiTietNhap) || 0),
      }))
      .filter((l) => l.soLuongCon > 0);

    const totalAvailable = lotsWithRemaining.reduce((acc, l) => acc + l.soLuongCon, 0);
    if (totalAvailable < totalBaseNeeded) {
      throw new Error('Không đủ số lượng hàng có thể bán');
    }

    const cthId = formatCode('CTH', nextCthNum++, 4);
    const prod = memoryStore.data.products.find((p) => p.maSanPham === it.maSanPham);
    const giaVon = prod?.giaNhapBinhQuan || 0;

    invoiceDetailsToCreate.push({
      maChiTietHoaDon: cthId,
      maHoaDon,
      maSanPham: it.maSanPham,
      maDonViBan: it.maDonViBan,
      tyLeQuyDoi: tyLe,
      soLuong: it.soLuong,
      donGia: it.donGia,
      giaVonBinhQuan: giaVon,
      thanhTien: it.thanhTien,
    });

    let needed = totalBaseNeeded;
    for (const lot of lotsWithRemaining) {
      if (needed <= 0) break;
      const take = Math.min(lot.soLuongCon, needed);
      needed -= take;

      plannedLotDeductions.set(
        lot.maChiTietNhap,
        (plannedLotDeductions.get(lot.maChiTietNhap) || 0) + take
      );

      const pbId = formatCode('PB', nextPbNum++, 4);
      allocationsToCreate.push({
        maPhanBo: pbId,
        maChiTietNhap: lot.maChiTietNhap,
        maChiTietHoaDon: cthId,
        maChiTietDoiTra: null,
        soLuongXuat: take,
      });
    }

    plannedProdDeductions.set(
      it.maSanPham,
      (plannedProdDeductions.get(it.maSanPham) || 0) + totalBaseNeeded
    );
  }

  // Apply planned mutations atomically after all validations succeed
  plannedLotDeductions.forEach((deduct, lotId) => {
    const storeLot = memoryStore.data.importDetails.find((l) => l.maChiTietNhap === lotId);
    if (storeLot) {
      storeLot.soLuongCon -= deduct;
    }
  });
  plannedProdDeductions.forEach((deduct, prodId) => {
    const prod = memoryStore.data.products.find((p) => p.maSanPham === prodId);
    if (prod) {
      prod.soLuongTon -= deduct;
      if (prod.soLuongTon <= prod.mucTonToiThieu && !warningLowStockProducts.includes(prod.tenSanPham)) {
        warningLowStockProducts.push(prod.tenSanPham);
      }
    }
  });

  const invoiceRecord = {
    maHoaDon,
    maKhachHang: payload.maKhachHang || null,
    ngayGioBan: now,
    tongTien,
    phuongThucThanhToan: payload.phuongThucThanhToan,
    tienKhachDua: payload.tienKhachDua ?? null,
    tienThua: payload.tienThua ?? null,
    trangThai: 'Đã thanh toán',
    lyDoHuy: null,
    thoiGianHuy: null,
  };

  memoryStore.data.invoices.push(invoiceRecord);
  memoryStore.data.invoiceDetails.push(...invoiceDetailsToCreate);
  memoryStore.data.allocations.push(...allocationsToCreate);

  const responseData = {
    invoice: invoiceRecord,
    warningLowStockProducts,
  };

  if (payload.idempotencyKey) {
    if (!(memoryStore.data as any).idempotency) (memoryStore.data as any).idempotency = [];
    (memoryStore.data as any).idempotency.push({
      key: payload.idempotencyKey,
      action: 'CREATE_SALE',
      response: JSON.stringify(responseData),
    });
  }

  return responseData;
}

export async function getSalesHistory(keyword?: string, fromDate?: string, toDate?: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const where: any = {};
    if (keyword) {
      where.OR = [
        { maHoaDon: { contains: keyword, mode: 'insensitive' } },
        { khachHang: { soDienThoai: { contains: keyword, mode: 'insensitive' } } },
      ];
    }
    if (fromDate || toDate) {
      where.ngayGioBan = {};
      if (fromDate) where.ngayGioBan.gte = new Date(fromDate);
      if (toDate) {
        const toD = new Date(toDate);
        toD.setHours(23, 59, 59, 999);
        where.ngayGioBan.lte = toD;
      }
    }
    return prisma.hoaDon.findMany({
      where,
      include: {
        khachHang: true,
        chiTietHoaDons: {
          include: { sanPham: true, donViBan: true },
        },
        phieuDoiTras: {
          include: { chiTietDoiTras: true },
        },
      },
      orderBy: { ngayGioBan: 'desc' },
    });
  }

  let list = memoryStore.data.invoices.map((inv) => {
    const kh = memoryStore.data.customers.find((c) => c.maKhachHang === inv.maKhachHang);
    const details = memoryStore.data.invoiceDetails
      .filter((d) => d.maHoaDon === inv.maHoaDon)
      .map((d) => {
        const prod = memoryStore.data.products.find((p) => p.maSanPham === d.maSanPham);
        const unit = memoryStore.data.units.find((u) => u.maDonVi === d.maDonViBan);
        return { ...d, sanPham: prod, donViBan: unit };
      });
    const dts = memoryStore.data.exchangeReturns
      .filter((dt) => dt.maHoaDon === inv.maHoaDon)
      .map((dt) => {
        const dtd = memoryStore.data.exchangeReturnDetails.filter(
          (c) => c.maPhieuDoiTra === dt.maPhieuDoiTra
        );
        return { ...dt, chiTietDoiTras: dtd };
      });
    return { ...inv, khachHang: kh, chiTietHoaDons: details, phieuDoiTras: dts };
  });

  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    list = list.filter(
      (inv) =>
        inv.maHoaDon.toLowerCase().includes(kw) ||
        (inv.khachHang && inv.khachHang.soDienThoai.toLowerCase().includes(kw))
    );
  }
  if (fromDate) {
    const f = new Date(fromDate).getTime();
    list = list.filter((inv) => new Date(inv.ngayGioBan).getTime() >= f);
  }
  if (toDate) {
    const toD = new Date(toDate);
    toD.setHours(23, 59, 59, 999);
    list = list.filter((inv) => new Date(inv.ngayGioBan).getTime() <= toD.getTime());
  }

  return list.sort((a, b) => new Date(b.ngayGioBan).getTime() - new Date(a.ngayGioBan).getTime());
}

export async function getInvoiceById(id: string) {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    return prisma.hoaDon.findUnique({
      where: { maHoaDon: id },
      include: {
        khachHang: true,
        chiTietHoaDons: {
          include: {
            sanPham: true,
            donViBan: true,
            phanBoXuatKhos: true,
          },
        },
        phieuDoiTras: {
          include: {
            chiTietDoiTras: {
              include: { sanPham: true, donVi: true },
            },
          },
        },
      },
    });
  }

  const inv = memoryStore.data.invoices.find((i) => i.maHoaDon === id);
  if (!inv) return null;
  const kh = memoryStore.data.customers.find((c) => c.maKhachHang === inv.maKhachHang);
  const details = memoryStore.data.invoiceDetails
    .filter((d) => d.maHoaDon === inv.maHoaDon)
    .map((d) => {
      const prod = memoryStore.data.products.find((p) => p.maSanPham === d.maSanPham);
      const unit = memoryStore.data.units.find((u) => u.maDonVi === d.maDonViBan);
      const pbs = memoryStore.data.allocations.filter((a) => a.maChiTietHoaDon === d.maChiTietHoaDon);
      return { ...d, sanPham: prod, donViBan: unit, phanBoXuatKhos: pbs };
    });
  const dts = memoryStore.data.exchangeReturns
    .filter((dt) => dt.maHoaDon === inv.maHoaDon)
    .map((dt) => {
      const dtd = memoryStore.data.exchangeReturnDetails
        .filter((c) => c.maPhieuDoiTra === dt.maPhieuDoiTra)
        .map((c) => {
          const prod = memoryStore.data.products.find((p) => p.maSanPham === c.maSanPham);
          const unit = memoryStore.data.units.find((u) => u.maDonVi === c.maDonVi);
          return { ...c, sanPham: prod, donVi: unit };
        });
      return { ...dt, chiTietDoiTras: dtd };
    });

  return { ...inv, khachHang: kh, chiTietHoaDons: details, phieuDoiTras: dts };
}

export async function cancelInvoice(
  maHoaDon: string,
  lyDoHuy: string,
  idempotencyKey?: string
) {
  const usePg = await isPostgresAvailable();
  const now = new Date();

  if (usePg) {
    return prisma.$transaction(async (tx) => {
      if (idempotencyKey) {
        const existing = await tx.idempotencyKey.findUnique({
          where: { key: idempotencyKey },
        });
        if (existing) {
          return existing.response ? JSON.parse(existing.response) : { success: true };
        }
      }

      // Lock invoice row first, then lock distinct products in sorted order
      await tx.$executeRaw`SELECT "maHoaDon" FROM "HoaDon" WHERE "maHoaDon" = ${maHoaDon} FOR UPDATE`;

      const inv = await tx.hoaDon.findUnique({
        where: { maHoaDon },
        include: {
          phieuDoiTras: true,
          chiTietHoaDons: {
            include: { phanBoXuatKhos: true },
          },
        },
      });

      if (!inv) throw new Error('Hóa đơn không tồn tại');
      if (inv.trangThai === 'Đã hủy') {
        throw new Error('Hóa đơn này đã được hủy trước đó');
      }
      if (inv.phieuDoiTras.length > 0) {
        throw new Error('Hóa đơn có giao dịch đổi/trả hàng, không thể hủy trực tiếp');
      }

      const productIds = Array.from(new Set(inv.chiTietHoaDons.map((d) => d.maSanPham))).sort();
      for (const pid of productIds) {
        await tx.$executeRaw`SELECT "maSanPham" FROM "SanPham" WHERE "maSanPham" = ${pid} FOR UPDATE`;
      }

      // Restore inventory per exact allocation
      for (const line of inv.chiTietHoaDons) {
        let totalBaseRestored = 0;
        for (const pb of line.phanBoXuatKhos) {
          await tx.chiTietNhapHang.update({
            where: { maChiTietNhap: pb.maChiTietNhap },
            data: { soLuongCon: { increment: pb.soLuongXuat } },
          });
          totalBaseRestored += pb.soLuongXuat;
        }

        await tx.sanPham.update({
          where: { maSanPham: line.maSanPham },
          data: { soLuongTon: { increment: totalBaseRestored } },
        });
      }

      await tx.hoaDon.update({
        where: { maHoaDon },
        data: {
          trangThai: 'Đã hủy',
          lyDoHuy,
          thoiGianHuy: now,
        },
      });

      const responseData = { success: true };
      if (idempotencyKey) {
        await tx.idempotencyKey.create({
          data: {
            key: idempotencyKey,
            action: 'CANCEL_INVOICE',
            response: JSON.stringify(responseData),
          },
        });
      }

      return responseData;
    });
  }

  // Memory store
  if (idempotencyKey) {
    const existing = (memoryStore.data as any).idempotency?.find(
      (k: any) => k.key === idempotencyKey
    );
    if (existing) {
      return existing.response ? JSON.parse(existing.response) : { success: true };
    }
  }

  const inv = memoryStore.data.invoices.find((i) => i.maHoaDon === maHoaDon);
  if (!inv) throw new Error('Hóa đơn không tồn tại');
  if (inv.trangThai === 'Đã hủy') {
    throw new Error('Hóa đơn này đã được hủy trước đó');
  }
  const hasDoiTra = memoryStore.data.exchangeReturns.some((dt) => dt.maHoaDon === maHoaDon);
  if (hasDoiTra) {
    throw new Error('Hóa đơn có giao dịch đổi/trả hàng, không thể hủy trực tiếp');
  }

  const lines = memoryStore.data.invoiceDetails.filter((d) => d.maHoaDon === maHoaDon);
  for (const line of lines) {
    const pbs = memoryStore.data.allocations.filter((a) => a.maChiTietHoaDon === line.maChiTietHoaDon);
    let totalBaseRestored = 0;
    for (const pb of pbs) {
      const lot = memoryStore.data.importDetails.find(
        (l) => l.maChiTietNhap === pb.maChiTietNhap
      );
      if (lot) {
        lot.soLuongCon += pb.soLuongXuat;
      }
      totalBaseRestored += pb.soLuongXuat;
    }
    const prod = memoryStore.data.products.find((p) => p.maSanPham === line.maSanPham);
    if (prod) {
      prod.soLuongTon += totalBaseRestored;
    }
  }

  inv.trangThai = 'Đã hủy';
  inv.lyDoHuy = lyDoHuy;
  inv.thoiGianHuy = now;

  const responseData = { success: true };
  if (idempotencyKey) {
    if (!(memoryStore.data as any).idempotency) (memoryStore.data as any).idempotency = [];
    (memoryStore.data as any).idempotency.push({
      key: idempotencyKey,
      action: 'CANCEL_INVOICE',
      response: JSON.stringify(responseData),
    });
  }

  return responseData;
}

// UC 6.5: Exchange & Return
export async function createExchangeReturn(payload: {
  maHoaDon: string;
  idempotencyKey?: string;
  itemsReturn: Array<{
    maChiTietHoaDon: string;
    soLuongTra: number;
    duocNhapLaiKho: boolean;
  }>;
  itemsExchange: Array<{
    maSanPham: string;
    maDonVi: string;
    soLuong: number;
  }>;
}) {
  const usePg = await isPostgresAvailable();
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (usePg) {
    return prisma.$transaction(async (tx) => {
      if (payload.idempotencyKey) {
        const existing = await tx.idempotencyKey.findUnique({
          where: { key: payload.idempotencyKey },
        });
        if (existing) {
          return existing.response ? JSON.parse(existing.response) : { success: true };
        }
      }

      await tx.$executeRaw`SELECT "maHoaDon" FROM "HoaDon" WHERE "maHoaDon" = ${payload.maHoaDon} FOR UPDATE`;

      const inv = await tx.hoaDon.findUnique({
        where: { maHoaDon: payload.maHoaDon },
        include: {
          chiTietHoaDons: {
            include: { phanBoXuatKhos: true },
          },
          phieuDoiTras: {
            include: { chiTietDoiTras: true },
          },
        },
      });

      if (!inv || inv.trangThai === 'Đã hủy') {
        throw new Error('Hóa đơn không thể đổi/trả hàng');
      }

      // Lock all affected products (returned + exchanged) in sorted order
      const productIds = Array.from(
        new Set([
          ...inv.chiTietHoaDons.map((d) => d.maSanPham),
          ...payload.itemsExchange.map((e) => e.maSanPham),
        ])
      ).sort();
      for (const pid of productIds) {
        await tx.$executeRaw`SELECT "maSanPham" FROM "SanPham" WHERE "maSanPham" = ${pid} FOR UPDATE`;
      }

      const maPhieuDoiTra = await getNextCode('DT', 4, tx, true);
      let nextCtdNum = await getNextCodeNumber('CTD', tx, true);
      let nextPbNum = await getNextCodeNumber('PB', tx, true);

      let tongTienHangTra = 0;
      let tongTienHangDoi = 0;
      const detailsToCreate: any[] = [];
      const allocationsToCreate: any[] = [];
      const inBatchReturnedUnits = new Map<string, number>();
      const inBatchRestoredBase = new Map<string, number>();

      // 1. Process returned items
      for (const ret of payload.itemsReturn) {
        const line = inv.chiTietHoaDons.find((d) => d.maChiTietHoaDon === ret.maChiTietHoaDon);
        if (!line) throw new Error('Dòng hóa đơn không hợp lệ');

        // Check already returned quantity (previous tickets + earlier lines in same batch)
        const returnedPrev = inv.phieuDoiTras.flatMap((p) =>
          p.chiTietDoiTras.filter((c) => c.maChiTietHoaDon === ret.maChiTietHoaDon && c.loaiDong === 'Hàng trả')
        );
        const totalReturnedPreviously = returnedPrev.reduce((acc, c) => acc + c.soLuong, 0);
        const extraReturnedInBatch = inBatchReturnedUnits.get(ret.maChiTietHoaDon) || 0;
        const remainingReturnable = line.soLuong - totalReturnedPreviously - extraReturnedInBatch;

        if (ret.soLuongTra <= 0 || ret.soLuongTra > remainingReturnable) {
          throw new Error('Số lượng trả không hợp lệ');
        }
        inBatchReturnedUnits.set(ret.maChiTietHoaDon, extraReturnedInBatch + ret.soLuongTra);

        const thanhTienTra = ret.soLuongTra * Number(line.donGia);
        tongTienHangTra += thanhTienTra;

        const ctdId = formatCode('CTD', nextCtdNum++, 4);
        detailsToCreate.push({
          maChiTiet: ctdId,
          maPhieuDoiTra,
          maChiTietHoaDon: ret.maChiTietHoaDon,
          maDonVi: line.maDonViBan,
          maSanPham: line.maSanPham,
          loaiDong: 'Hàng trả',
          tyLeQuyDoi: line.tyLeQuyDoi,
          soLuong: ret.soLuongTra,
          donGia: line.donGia,
          giaVonBinhQuan: line.giaVonBinhQuan,
          thanhTien: thanhTienTra,
          duocNhapLaiKho: ret.duocNhapLaiKho,
        });

        // If restock: restore in reverse order of allocations (LIFO), capped by exported minus previously restored
        if (ret.duocNhapLaiKho) {
          const priorRestoredBase = returnedPrev
            .filter((c) => c.duocNhapLaiKho)
            .reduce((acc, c) => acc + c.soLuong * c.tyLeQuyDoi, 0);
          const batchRestoredBase = inBatchRestoredBase.get(ret.maChiTietHoaDon) || 0;
          let skipBase = priorRestoredBase + batchRestoredBase;

          let baseToRestore = ret.soLuongTra * line.tyLeQuyDoi;
          inBatchRestoredBase.set(ret.maChiTietHoaDon, batchRestoredBase + baseToRestore);

          const sortedPbs = [...line.phanBoXuatKhos].reverse();

          for (const pb of sortedPbs) {
            if (baseToRestore <= 0) break;
            const alreadyRestoredFromPb = Math.min(pb.soLuongXuat, skipBase);
            skipBase -= alreadyRestoredFromPb;
            const remainingCapacity = pb.soLuongXuat - alreadyRestoredFromPb;
            if (remainingCapacity <= 0) continue;

            const restoreAmount = Math.min(remainingCapacity, baseToRestore);
            baseToRestore -= restoreAmount;

            await tx.chiTietNhapHang.update({
              where: { maChiTietNhap: pb.maChiTietNhap },
              data: { soLuongCon: { increment: restoreAmount } },
            });
          }

          await tx.sanPham.update({
            where: { maSanPham: line.maSanPham },
            data: { soLuongTon: { increment: ret.soLuongTra * line.tyLeQuyDoi } },
          });
        }
      }

      // 2. Process exchanged items
      for (const ex of payload.itemsExchange) {
        const unit = await tx.donViQuyDoi.findUnique({ where: { maDonVi: ex.maDonVi } });
        if (!unit) throw new Error('Đơn vị hàng đổi không hợp lệ');
        const prod = await tx.sanPham.findUnique({ where: { maSanPham: ex.maSanPham } });
        if (!prod) throw new Error('Sản phẩm đổi không hợp lệ');

        const totalBaseNeeded = ex.soLuong * unit.heSoQuyDoi;
        const rawLots = await tx.chiTietNhapHang.findMany({
          where: {
            maSanPham: ex.maSanPham,
            soLuongCon: { gt: 0 },
            OR: [{ hanSuDung: null }, { hanSuDung: { gte: today } }],
          },
          include: { phieuNhap: true },
        });
        const lots = sortLotsFEFO(rawLots);

        const totalAvailable = lots.reduce((acc, l) => acc + l.soLuongCon, 0);
        if (totalAvailable < totalBaseNeeded) {
          throw new Error('Không đủ số lượng hàng có thể bán');
        }

        const thanhTienDoi = ex.soLuong * Number(unit.giaBan);
        tongTienHangDoi += thanhTienDoi;

        const ctdId = formatCode('CTD', nextCtdNum++, 4);
        detailsToCreate.push({
          maChiTiet: ctdId,
          maPhieuDoiTra,
          maChiTietHoaDon: null,
          maDonVi: ex.maDonVi,
          maSanPham: ex.maSanPham,
          loaiDong: 'Hàng đổi',
          tyLeQuyDoi: unit.heSoQuyDoi,
          soLuong: ex.soLuong,
          donGia: unit.giaBan,
          giaVonBinhQuan: prod.giaNhapBinhQuan,
          thanhTien: thanhTienDoi,
          duocNhapLaiKho: false,
        });

        let needed = totalBaseNeeded;
        for (const lot of lots) {
          if (needed <= 0) break;
          const take = Math.min(lot.soLuongCon, needed);
          needed -= take;

          await tx.chiTietNhapHang.update({
            where: { maChiTietNhap: lot.maChiTietNhap },
            data: { soLuongCon: lot.soLuongCon - take },
          });

          const pbId = formatCode('PB', nextPbNum++, 4);
          allocationsToCreate.push({
            maPhanBo: pbId,
            maChiTietNhap: lot.maChiTietNhap,
            maChiTietHoaDon: null,
            maChiTietDoiTra: ctdId,
            soLuongXuat: take,
          });
        }

        await tx.sanPham.update({
          where: { maSanPham: ex.maSanPham },
          data: { soLuongTon: { decrement: totalBaseNeeded } },
        });
      }

      const tienChenhLech = tongTienHangDoi - tongTienHangTra;

      const phieu = await tx.phieuDoiTra.create({
        data: {
          maPhieuDoiTra,
          maHoaDon: payload.maHoaDon,
          ngayGioDoiTra: now,
          tongTienHangTra,
          tongTienHangDoi,
          tienChenhLech,
          trangThai: 'Hoàn tất',
        },
      });

      for (const d of detailsToCreate) {
        await tx.chiTietDoiTra.create({ data: d });
      }
      for (const a of allocationsToCreate) {
        await tx.phanBoXuatKho.create({ data: a });
      }

      const responseData = { success: true, phieu };
      if (payload.idempotencyKey) {
        await tx.idempotencyKey.create({
          data: {
            key: payload.idempotencyKey,
            action: 'EXCHANGE_RETURN',
            response: JSON.stringify(responseData),
          },
        });
      }

      return responseData;
    });
  }

  // Memory store
  if (payload.idempotencyKey) {
    const existing = (memoryStore.data as any).idempotency?.find(
      (k: any) => k.key === payload.idempotencyKey
    );
    if (existing) {
      return existing.response ? JSON.parse(existing.response) : { success: true };
    }
  }

  const inv = memoryStore.data.invoices.find((i) => i.maHoaDon === payload.maHoaDon);
  if (!inv || inv.trangThai === 'Đã hủy') {
    throw new Error('Hóa đơn không thể đổi/trả hàng');
  }

  const maPhieuDoiTra = await getNextCode('DT', 4);
  let nextCtdNum = await getNextCodeNumber('CTD');
  let nextPbNum = await getNextCodeNumber('PB');

  let tongTienHangTra = 0;
  let tongTienHangDoi = 0;
  const detailsToCreate: any[] = [];
  const allocationsToCreate: any[] = [];
  const inBatchReturnedUnits = new Map<string, number>();
  const inBatchRestoredBase = new Map<string, number>();
  // Track net planned deltas per lot & product so validation failures stay atomic
  const plannedLotDeltas = new Map<string, number>();
  const plannedProdDeltas = new Map<string, number>();

  for (const ret of payload.itemsReturn) {
    const line = memoryStore.data.invoiceDetails.find(
      (d) => d.maChiTietHoaDon === ret.maChiTietHoaDon
    );
    if (!line) throw new Error('Dòng hóa đơn không hợp lệ');

    const previousReturns = memoryStore.data.exchangeReturnDetails.filter(
      (c) => c.maChiTietHoaDon === ret.maChiTietHoaDon && c.loaiDong === 'Hàng trả'
    );
    const totalReturned = previousReturns.reduce((acc, c) => acc + c.soLuong, 0);
    const extraInBatch = inBatchReturnedUnits.get(ret.maChiTietHoaDon) || 0;
    const remaining = line.soLuong - totalReturned - extraInBatch;

    if (ret.soLuongTra <= 0 || ret.soLuongTra > remaining) {
      throw new Error('Số lượng trả không hợp lệ');
    }
    inBatchReturnedUnits.set(ret.maChiTietHoaDon, extraInBatch + ret.soLuongTra);

    const thanhTienTra = ret.soLuongTra * Number(line.donGia);
    tongTienHangTra += thanhTienTra;

    const ctdId = formatCode('CTD', nextCtdNum++, 4);
    detailsToCreate.push({
      maChiTiet: ctdId,
      maPhieuDoiTra,
      maChiTietHoaDon: ret.maChiTietHoaDon,
      maDonVi: line.maDonViBan,
      maSanPham: line.maSanPham,
      maPhanBo: null,
      loaiDong: 'Hàng trả',
      tyLeQuyDoi: line.tyLeQuyDoi,
      soLuong: ret.soLuongTra,
      donGia: line.donGia,
      giaVonBinhQuan: line.giaVonBinhQuan,
      thanhTien: thanhTienTra,
      duocNhapLaiKho: ret.duocNhapLaiKho,
    });

    if (ret.duocNhapLaiKho) {
      const priorRestoredBase = previousReturns
        .filter((c) => c.duocNhapLaiKho)
        .reduce((acc, c) => acc + c.soLuong * c.tyLeQuyDoi, 0);
      const batchRestoredBase = inBatchRestoredBase.get(ret.maChiTietHoaDon) || 0;
      let skipBase = priorRestoredBase + batchRestoredBase;

      let baseToRestore = ret.soLuongTra * line.tyLeQuyDoi;
      inBatchRestoredBase.set(ret.maChiTietHoaDon, batchRestoredBase + baseToRestore);

      const pbs = memoryStore.data.allocations
        .filter((a) => a.maChiTietHoaDon === line.maChiTietHoaDon)
        .reverse();

      for (const pb of pbs) {
        if (baseToRestore <= 0) break;
        const alreadyRestoredFromPb = Math.min(pb.soLuongXuat, skipBase);
        skipBase -= alreadyRestoredFromPb;
        const remainingCapacity = pb.soLuongXuat - alreadyRestoredFromPb;
        if (remainingCapacity <= 0) continue;

        const take = Math.min(remainingCapacity, baseToRestore);
        baseToRestore -= take;
        plannedLotDeltas.set(pb.maChiTietNhap, (plannedLotDeltas.get(pb.maChiTietNhap) || 0) + take);
      }

      plannedProdDeltas.set(
        line.maSanPham,
        (plannedProdDeltas.get(line.maSanPham) || 0) + ret.soLuongTra * line.tyLeQuyDoi
      );
    }
  }

  for (const ex of payload.itemsExchange) {
    const unit = memoryStore.data.units.find((u) => u.maDonVi === ex.maDonVi);
    if (!unit) throw new Error('Đơn vị hàng đổi không hợp lệ');
    const prod = memoryStore.data.products.find((p) => p.maSanPham === ex.maSanPham);
    if (!prod) throw new Error('Sản phẩm đổi không hợp lệ');

    const totalBaseNeeded = ex.soLuong * unit.heSoQuyDoi;
    const rawLots = await getSellableInventoryLots(ex.maSanPham);
    const lotsWithPlanned = rawLots
      .map((l) => ({
        ...l,
        soLuongCon: l.soLuongCon + (plannedLotDeltas.get(l.maChiTietNhap) || 0),
      }))
      .filter((l) => l.soLuongCon > 0);

    const totalAvailable = lotsWithPlanned.reduce((acc, l) => acc + l.soLuongCon, 0);
    if (totalAvailable < totalBaseNeeded) {
      throw new Error('Không đủ số lượng hàng có thể bán');
    }

    const thanhTienDoi = ex.soLuong * Number(unit.giaBan);
    tongTienHangDoi += thanhTienDoi;

    const ctdId = formatCode('CTD', nextCtdNum++, 4);
    detailsToCreate.push({
      maChiTiet: ctdId,
      maPhieuDoiTra,
      maChiTietHoaDon: null,
      maDonVi: ex.maDonVi,
      maSanPham: ex.maSanPham,
      maPhanBo: null,
      loaiDong: 'Hàng đổi',
      tyLeQuyDoi: unit.heSoQuyDoi,
      soLuong: ex.soLuong,
      donGia: unit.giaBan,
      giaVonBinhQuan: prod.giaNhapBinhQuan,
      thanhTien: thanhTienDoi,
      duocNhapLaiKho: false,
    });

    let needed = totalBaseNeeded;
    for (const lot of lotsWithPlanned) {
      if (needed <= 0) break;
      const take = Math.min(lot.soLuongCon, needed);
      needed -= take;

      plannedLotDeltas.set(lot.maChiTietNhap, (plannedLotDeltas.get(lot.maChiTietNhap) || 0) - take);

      const pbId = formatCode('PB', nextPbNum++, 4);
      allocationsToCreate.push({
        maPhanBo: pbId,
        maChiTietNhap: lot.maChiTietNhap,
        maChiTietHoaDon: null,
        maChiTietDoiTra: ctdId,
        soLuongXuat: take,
      });
    }

    plannedProdDeltas.set(
      ex.maSanPham,
      (plannedProdDeltas.get(ex.maSanPham) || 0) - totalBaseNeeded
    );
  }

  // Apply planned deltas after all validations pass
  plannedLotDeltas.forEach((delta, lotId) => {
    const lot = memoryStore.data.importDetails.find((l) => l.maChiTietNhap === lotId);
    if (lot) lot.soLuongCon += delta;
  });
  plannedProdDeltas.forEach((delta, prodId) => {
    const prod = memoryStore.data.products.find((p) => p.maSanPham === prodId);
    if (prod) prod.soLuongTon += delta;
  });

  const tienChenhLech = tongTienHangDoi - tongTienHangTra;
  const phieu = {
    maPhieuDoiTra,
    maHoaDon: payload.maHoaDon,
    ngayGioDoiTra: now,
    tongTienHangTra,
    tongTienHangDoi,
    tienChenhLech,
    trangThai: 'Hoàn tất',
  };

  memoryStore.data.exchangeReturns.push(phieu);
  memoryStore.data.exchangeReturnDetails.push(...detailsToCreate);
  memoryStore.data.allocations.push(...allocationsToCreate);

  const responseData = { success: true, phieu };
  if (payload.idempotencyKey) {
    if (!(memoryStore.data as any).idempotency) (memoryStore.data as any).idempotency = [];
    (memoryStore.data as any).idempotency.push({
      key: payload.idempotencyKey,
      action: 'EXCHANGE_RETURN',
      response: JSON.stringify(responseData),
    });
  }

  return responseData;
}

// ==========================================
// REPORTS (UC 3.1, 3.2, 3.3)
// ==========================================

export async function calculateBusinessReport(params: {
  fromDate?: string;
  toDate?: string;
  productId?: string;
  categoryId?: string;
  rankingBy?: 'quantity' | 'revenue';
}) {
  const from = params.fromDate ? new Date(params.fromDate) : new Date(0);
  from.setHours(0, 0, 0, 0);
  const to = params.toDate ? new Date(params.toDate) : new Date();
  to.setHours(23, 59, 59, 999);

  const history = await getSalesHistory();
  const allProducts = await getProducts();
  const allExchange = await (async () => {
    const usePg = await isPostgresAvailable();
    if (usePg) {
      return prisma.phieuDoiTra.findMany({
        include: { chiTietDoiTras: { include: { sanPham: true } } },
      });
    }
    return memoryStore.data.exchangeReturns.map((dt) => {
      const dtd = memoryStore.data.exchangeReturnDetails
        .filter((c) => c.maPhieuDoiTra === dt.maPhieuDoiTra)
        .map((c) => {
          const prod = memoryStore.data.products.find((p) => p.maSanPham === c.maSanPham);
          return { ...c, sanPham: prod };
        });
      return { ...dt, chiTietDoiTras: dtd };
    });
  })();

  // Filter invoices in period
  // BR-UC3-05:
  // Doanh thu thuần = Tổng tiền hóa đơn đã thanh toán trong kỳ (không tính hóa đơn đã hủy)
  // + Tổng tiền hàng đổi mới − Tổng tiền hàng khách trả lại.
  // Hóa đơn hủy tính theo ngày hủy: loại khỏi doanh thu của kỳ chứa ngày hủy.
  const paidInvoices = history.filter((inv) => {
    const d = new Date(inv.ngayGioBan);
    if (d < from || d > to) return false;
    if (inv.trangThai === 'Đã hủy') {
      // If cancelled in this period, excluded from this period!
      return false;
    }
    return true;
  });

  // Exchange tickets in period
  const periodExchanges = allExchange.filter((dt) => {
    const d = new Date(dt.ngayGioDoiTra);
    return d >= from && d <= to;
  });

  let totalInvoiceRevenue = 0;
  let totalCOGS = 0;

  // Track per-product metrics
  const productStats: Record<
    string,
    {
      maSanPham: string;
      tenSanPham: string;
      donViTinh: string;
      soLuongBanThuan: number;
      doanhThuThuan: number;
      giaVon: number;
      soLuongTon: number;
    }
  > = {};

  for (const p of allProducts) {
    if (params.productId && p.maSanPham !== params.productId) continue;
    if (params.categoryId && p.maDanhMuc !== params.categoryId) continue;

    productStats[p.maSanPham] = {
      maSanPham: p.maSanPham,
      tenSanPham: p.tenSanPham,
      donViTinh: p.donViTinh,
      soLuongBanThuan: 0,
      doanhThuThuan: 0,
      giaVon: 0,
      soLuongTon: p.soLuongTon,
    };
  }

  // Add sales from paid invoices
  for (const inv of paidInvoices) {
    totalInvoiceRevenue += Number(inv.tongTien);
    for (const line of inv.chiTietHoaDons) {
      if (productStats[line.maSanPham]) {
        const baseQty = line.soLuong * line.tyLeQuyDoi;
        const lineCOGS = baseQty * Number(line.giaVonBinhQuan);
        productStats[line.maSanPham].soLuongBanThuan += baseQty;
        productStats[line.maSanPham].doanhThuThuan += Number(line.thanhTien);
        productStats[line.maSanPham].giaVon += lineCOGS;
        totalCOGS += lineCOGS;
      }
    }
  }

  // Adjust for returns and exchanges in this period
  let totalExchangeRevenue = 0;
  let totalReturnAmount = 0;

  for (const dt of periodExchanges) {
    for (const d of dt.chiTietDoiTras) {
      if (d.loaiDong === 'Hàng trả') {
        totalReturnAmount += Number(d.thanhTien);
        if (productStats[d.maSanPham]) {
          const baseQty = d.soLuong * d.tyLeQuyDoi;
          const returnCOGS = baseQty * Number(d.giaVonBinhQuan);
          productStats[d.maSanPham].soLuongBanThuan -= baseQty;
          productStats[d.maSanPham].doanhThuThuan -= Number(d.thanhTien);
          productStats[d.maSanPham].giaVon -= returnCOGS;
          totalCOGS -= returnCOGS;
        }
      } else if (d.loaiDong === 'Hàng đổi') {
        totalExchangeRevenue += Number(d.thanhTien);
        if (productStats[d.maSanPham]) {
          const baseQty = d.soLuong * d.tyLeQuyDoi;
          const exCOGS = baseQty * Number(d.giaVonBinhQuan);
          productStats[d.maSanPham].soLuongBanThuan += baseQty;
          productStats[d.maSanPham].doanhThuThuan += Number(d.thanhTien);
          productStats[d.maSanPham].giaVon += exCOGS;
          totalCOGS += exCOGS;
        }
      }
    }
  }

  const doanhThuThuan = totalInvoiceRevenue + totalExchangeRevenue - totalReturnAmount;
  const loiNhuanGop = doanhThuThuan - totalCOGS;

  const statList = Object.values(productStats);

  // Top 10 Best Sellers (BR-UC3-09: sorted descending by quantity or revenue)
  const rankingKey = params.rankingBy === 'revenue' ? 'doanhThuThuan' : 'soLuongBanThuan';
  const topSellers = [...statList]
    .filter((s) => s[rankingKey] > 0)
    .sort((a, b) => b[rankingKey] - a[rankingKey])
    .slice(0, 10);

  // Top 10 Slow Sellers (BR-UC3-10: lowest quantity or 0, only products with stock > 0, sorted ascending)
  const slowSellers = [...statList]
    .filter((s) => s.soLuongTon > 0)
    .sort((a, b) => a.soLuongBanThuan - b.soLuongBanThuan)
    .slice(0, 10);

  // Trend chart breakdown (e.g. by day)
  const trendMap: Record<string, { date: string; revenue: number; profit: number }> = {};
  for (const inv of paidInvoices) {
    const dStr = new Date(inv.ngayGioBan).toISOString().slice(0, 10);
    if (!trendMap[dStr]) trendMap[dStr] = { date: dStr, revenue: 0, profit: 0 };
    trendMap[dStr].revenue += Number(inv.tongTien);
    let invCOGS = 0;
    for (const l of inv.chiTietHoaDons) {
      invCOGS += l.soLuong * l.tyLeQuyDoi * Number(l.giaVonBinhQuan);
    }
    trendMap[dStr].profit += Number(inv.tongTien) - invCOGS;
  }
  const trend = Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));

  return {
    doanhThuThuan,
    soHoaDon: paidInvoices.length,
    tongGiaVon: totalCOGS,
    loiNhuanGop,
    topSellers,
    slowSellers,
    trend,
    statList,
  };
}

export async function calculateInventoryReport(params: {
  fromDate?: string;
  toDate?: string;
  productId?: string;
  categoryId?: string;
}) {
  const from = params.fromDate ? new Date(params.fromDate) : new Date(0);
  from.setHours(0, 0, 0, 0);
  const to = params.toDate ? new Date(params.toDate) : new Date();
  to.setHours(23, 59, 59, 999);

  const allProducts = await getProducts();
  const imports = await getImportHistory();
  const sales = await getSalesHistory();
  const usePg = await isPostgresAvailable();

  const allExchanges = await (async () => {
    if (usePg) {
      return prisma.phieuDoiTra.findMany({
        include: { chiTietDoiTras: true },
      });
    }
    return memoryStore.data.exchangeReturns.map((dt) => {
      const dtd = memoryStore.data.exchangeReturnDetails.filter(
        (c) => c.maPhieuDoiTra === dt.maPhieuDoiTra
      );
      return { ...dt, chiTietDoiTras: dtd };
    });
  })();

  const adjustments = await (async () => {
    if (usePg) {
      return prisma.phieuDieuChinhTonKho.findMany({});
    }
    return (memoryStore.data as any).adjustments || [];
  })();

  const reportItems: any[] = [];

  for (const prod of allProducts) {
    if (params.productId && prod.maSanPham !== params.productId) continue;
    if (params.categoryId && prod.maDanhMuc !== params.categoryId) continue;

    // 1. Transactions before period (to calculate Tồn đầu kỳ)
    let preImport = 0;
    let preExport = 0;
    let preAdjInc = 0;
    let preAdjDec = 0;

    // 2. Transactions during period
    let periodImport = 0;
    let periodExport = 0;
    let periodAdjInc = 0;
    let periodAdjDec = 0;

    // A. Imports
    for (const t of imports) {
      const tDate = new Date(t.ngayNhap);
      for (const d of t.chiTietNhaps) {
        if (d.maSanPham === prod.maSanPham) {
          const baseQty = d.soLuongNhap * d.tyLeQuyDoi;
          if (tDate < from) preImport += baseQty;
          else if (tDate <= to) periodImport += baseQty;
        }
      }
    }

    // B. Sales (Paid invoices count as export, cancelled invoices in period count as import back!)
    for (const inv of sales) {
      const saleDate = new Date(inv.ngayGioBan);
      const isCancelled = inv.trangThai === 'Đã hủy';
      const cancelDate = inv.thoiGianHuy ? new Date(inv.thoiGianHuy) : null;

      for (const line of inv.chiTietHoaDons) {
        if (line.maSanPham === prod.maSanPham) {
          const baseQty = line.soLuong * line.tyLeQuyDoi;

          if (saleDate < from) {
            preExport += baseQty;
          } else if (saleDate <= to) {
            periodExport += baseQty;
          }

          // Cancellation returns goods:
          if (isCancelled && cancelDate) {
            if (cancelDate < from) {
              preImport += baseQty;
            } else if (cancelDate <= to) {
              periodImport += baseQty;
            }
          }
        }
      }
    }

    // C. Returns and exchanges
    for (const dt of allExchanges) {
      const dtDate = new Date(dt.ngayGioDoiTra);
      for (const d of dt.chiTietDoiTras) {
        if (d.maSanPham === prod.maSanPham) {
          const baseQty = d.soLuong * d.tyLeQuyDoi;
          if (d.loaiDong === 'Hàng trả' && d.duocNhapLaiKho) {
            // Hàng trả khách được tính vào nhập (nếu nhập lại kho)
            if (dtDate < from) preImport += baseQty;
            else if (dtDate <= to) periodImport += baseQty;
          } else if (d.loaiDong === 'Hàng đổi') {
            // Hàng đổi mới được tính vào xuất
            if (dtDate < from) preExport += baseQty;
            else if (dtDate <= to) periodExport += baseQty;
          }
        }
      }
    }

    // D. Adjustments
    for (const adj of adjustments) {
      if (adj.maSanPham === prod.maSanPham) {
        const adjDate = new Date(adj.ngayDieuChinh);
        const diff = adj.chenhLech;
        if (adjDate < from) {
          if (diff > 0) preAdjInc += diff;
          else preAdjDec += Math.abs(diff);
        } else if (adjDate <= to) {
          if (diff > 0) periodAdjInc += diff;
          else periodAdjDec += Math.abs(diff);
        }
      }
    }

    // Tồn đầu kỳ = PreImport - PreExport + PreAdjInc - PreAdjDec
    const tonDauKy = Math.max(0, preImport - preExport + preAdjInc - preAdjDec);
    // Tồn cuối kỳ = Tồn đầu kỳ + Tổng nhập - Tổng xuất + Điều chỉnh tăng - Điều chỉnh giảm
    const tonCuoiKy = Math.max(0, tonDauKy + periodImport - periodExport + periodAdjInc - periodAdjDec);
    // Giá trị tồn = Tồn cuối kỳ * Giá nhập bình quân
    const giaTriTon = tonCuoiKy * Number(prod.giaNhapBinhQuan);

    reportItems.push({
      maSanPham: prod.maSanPham,
      tenSanPham: prod.tenSanPham,
      donViTinh: prod.donViTinh,
      tonDauKy,
      nhap: periodImport,
      xuat: periodExport,
      dieuChinhTang: periodAdjInc,
      dieuChinhGiam: periodAdjDec,
      tonCuoiKy,
      giaNhapBinhQuan: Number(prod.giaNhapBinhQuan),
      giaTriTon,
    });
  }

  return reportItems;
}
