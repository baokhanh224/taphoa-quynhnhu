
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TaiKhoanScalarFieldEnum = {
  maTaiKhoan: 'maTaiKhoan',
  tenDangNhap: 'tenDangNhap',
  matKhau: 'matKhau'
};

exports.Prisma.DanhMucSanPhamScalarFieldEnum = {
  maDanhMuc: 'maDanhMuc',
  tenDanhMuc: 'tenDanhMuc'
};

exports.Prisma.NhaCungCapScalarFieldEnum = {
  maNhaCungCap: 'maNhaCungCap',
  tenNhaCungCap: 'tenNhaCungCap',
  soDienThoai: 'soDienThoai',
  email: 'email',
  diaChi: 'diaChi',
  danhMuc: 'danhMuc',
  trangThai: 'trangThai',
  moTa: 'moTa'
};

exports.Prisma.SanPhamScalarFieldEnum = {
  maSanPham: 'maSanPham',
  tenSanPham: 'tenSanPham',
  maDanhMuc: 'maDanhMuc',
  maVach: 'maVach',
  donViTinh: 'donViTinh',
  giaNhapBinhQuan: 'giaNhapBinhQuan',
  soLuongTon: 'soLuongTon',
  mucTonToiThieu: 'mucTonToiThieu',
  quanLyHanSuDung: 'quanLyHanSuDung',
  trangThai: 'trangThai',
  moTa: 'moTa'
};

exports.Prisma.DonViQuyDoiScalarFieldEnum = {
  maDonVi: 'maDonVi',
  maSanPham: 'maSanPham',
  tenDonVi: 'tenDonVi',
  heSoQuyDoi: 'heSoQuyDoi',
  giaBan: 'giaBan'
};

exports.Prisma.LichSuGiaBanScalarFieldEnum = {
  maLichSu: 'maLichSu',
  maDonVi: 'maDonVi',
  giaCu: 'giaCu',
  giaMoi: 'giaMoi',
  thoiDiemThayDoi: 'thoiDiemThayDoi'
};

exports.Prisma.PhieuNhapHangScalarFieldEnum = {
  maPhieuNhap: 'maPhieuNhap',
  maNhaCungCap: 'maNhaCungCap',
  ngayNhap: 'ngayNhap',
  tongTien: 'tongTien'
};

exports.Prisma.ChiTietNhapHangScalarFieldEnum = {
  maChiTietNhap: 'maChiTietNhap',
  maPhieuNhap: 'maPhieuNhap',
  maSanPham: 'maSanPham',
  maDonViNhap: 'maDonViNhap',
  tyLeQuyDoi: 'tyLeQuyDoi',
  soLuongNhap: 'soLuongNhap',
  soLuongCon: 'soLuongCon',
  giaNhap: 'giaNhap',
  thanhTien: 'thanhTien',
  hanSuDung: 'hanSuDung'
};

exports.Prisma.PhieuDieuChinhTonKhoScalarFieldEnum = {
  maPhieuDieuChinh: 'maPhieuDieuChinh',
  maSanPham: 'maSanPham',
  maChiTietNhap: 'maChiTietNhap',
  ngayDieuChinh: 'ngayDieuChinh',
  soLuongCu: 'soLuongCu',
  soLuongMoi: 'soLuongMoi',
  lyDo: 'lyDo',
  chenhLech: 'chenhLech'
};

exports.Prisma.KhachHangScalarFieldEnum = {
  maKhachHang: 'maKhachHang',
  tenKhachHang: 'tenKhachHang',
  soDienThoai: 'soDienThoai',
  diaChi: 'diaChi'
};

exports.Prisma.HoaDonScalarFieldEnum = {
  maHoaDon: 'maHoaDon',
  maKhachHang: 'maKhachHang',
  ngayGioBan: 'ngayGioBan',
  tongTien: 'tongTien',
  phuongThucThanhToan: 'phuongThucThanhToan',
  tienKhachDua: 'tienKhachDua',
  tienThua: 'tienThua',
  trangThai: 'trangThai',
  lyDoHuy: 'lyDoHuy',
  thoiGianHuy: 'thoiGianHuy'
};

exports.Prisma.ChiTietHoaDonScalarFieldEnum = {
  maChiTietHoaDon: 'maChiTietHoaDon',
  maHoaDon: 'maHoaDon',
  maSanPham: 'maSanPham',
  maDonViBan: 'maDonViBan',
  tyLeQuyDoi: 'tyLeQuyDoi',
  soLuong: 'soLuong',
  donGia: 'donGia',
  giaVonBinhQuan: 'giaVonBinhQuan',
  thanhTien: 'thanhTien'
};

exports.Prisma.PhieuDoiTraScalarFieldEnum = {
  maPhieuDoiTra: 'maPhieuDoiTra',
  maHoaDon: 'maHoaDon',
  ngayGioDoiTra: 'ngayGioDoiTra',
  tongTienHangTra: 'tongTienHangTra',
  tongTienHangDoi: 'tongTienHangDoi',
  tienChenhLech: 'tienChenhLech',
  trangThai: 'trangThai'
};

exports.Prisma.ChiTietDoiTraScalarFieldEnum = {
  maChiTiet: 'maChiTiet',
  maPhieuDoiTra: 'maPhieuDoiTra',
  maChiTietHoaDon: 'maChiTietHoaDon',
  maDonVi: 'maDonVi',
  maSanPham: 'maSanPham',
  maPhanBo: 'maPhanBo',
  loaiDong: 'loaiDong',
  tyLeQuyDoi: 'tyLeQuyDoi',
  soLuong: 'soLuong',
  donGia: 'donGia',
  giaVonBinhQuan: 'giaVonBinhQuan',
  thanhTien: 'thanhTien',
  duocNhapLaiKho: 'duocNhapLaiKho'
};

exports.Prisma.PhanBoXuatKhoScalarFieldEnum = {
  maPhanBo: 'maPhanBo',
  maChiTietNhap: 'maChiTietNhap',
  maChiTietHoaDon: 'maChiTietHoaDon',
  maChiTietDoiTra: 'maChiTietDoiTra',
  soLuongXuat: 'soLuongXuat'
};

exports.Prisma.IdempotencyKeyScalarFieldEnum = {
  key: 'key',
  action: 'action',
  response: 'response',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  TaiKhoan: 'TaiKhoan',
  DanhMucSanPham: 'DanhMucSanPham',
  NhaCungCap: 'NhaCungCap',
  SanPham: 'SanPham',
  DonViQuyDoi: 'DonViQuyDoi',
  LichSuGiaBan: 'LichSuGiaBan',
  PhieuNhapHang: 'PhieuNhapHang',
  ChiTietNhapHang: 'ChiTietNhapHang',
  PhieuDieuChinhTonKho: 'PhieuDieuChinhTonKho',
  KhachHang: 'KhachHang',
  HoaDon: 'HoaDon',
  ChiTietHoaDon: 'ChiTietHoaDon',
  PhieuDoiTra: 'PhieuDoiTra',
  ChiTietDoiTra: 'ChiTietDoiTra',
  PhanBoXuatKho: 'PhanBoXuatKho',
  IdempotencyKey: 'IdempotencyKey'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
