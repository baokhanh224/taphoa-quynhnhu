
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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




  const path = require('path')

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\PC\\.gemini\\antigravity\\scratch\\taphoa-quynhnhu\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\PC\\.gemini\\antigravity\\scratch\\taphoa-quynhnhu\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/generated/client\"\n}\n\nmodel TaiKhoan {\n  maTaiKhoan  String @id @db.VarChar(6)\n  tenDangNhap String @unique @db.VarChar(50)\n  matKhau     String @db.VarChar(250)\n}\n\nmodel DanhMucSanPham {\n  maDanhMuc  String    @id @db.VarChar(6)\n  tenDanhMuc String    @db.VarChar(50)\n  sanPhams   SanPham[]\n}\n\nmodel NhaCungCap {\n  maNhaCungCap  String          @id @db.VarChar(6)\n  tenNhaCungCap String          @db.VarChar(100)\n  soDienThoai   String          @db.VarChar(10)\n  email         String?         @db.VarChar(250)\n  diaChi        String?         @db.VarChar(250)\n  danhMuc       String?         @db.VarChar(20)\n  trangThai     String          @default(\"Đang hợp tác\") @db.VarChar(20)\n  moTa          String?         @db.VarChar(250)\n  phieuNhaps    PhieuNhapHang[]\n}\n\nmodel SanPham {\n  maSanPham       String  @id @db.VarChar(6)\n  tenSanPham      String  @db.VarChar(100)\n  maDanhMuc       String  @db.VarChar(6)\n  maVach          String? @db.VarChar(50)\n  donViTinh       String  @db.VarChar(20)\n  giaNhapBinhQuan Decimal @default(0) @db.Decimal(18, 2)\n  soLuongTon      Int     @default(0)\n  mucTonToiThieu  Int     @default(0)\n  quanLyHanSuDung Boolean @default(false)\n  trangThai       String  @default(\"Đang kinh doanh\") @db.VarChar(20)\n  moTa            String? @db.VarChar(250)\n\n  danhMuc         DanhMucSanPham         @relation(fields: [maDanhMuc], references: [maDanhMuc])\n  donViQuyDois    DonViQuyDoi[]\n  chiTietNhaps    ChiTietNhapHang[]\n  phieuDieuChinhs PhieuDieuChinhTonKho[]\n  chiTietHoaDons  ChiTietHoaDon[]\n  chiTietDoiTras  ChiTietDoiTra[]\n}\n\nmodel DonViQuyDoi {\n  maDonVi    String  @id @db.VarChar(6)\n  maSanPham  String  @db.VarChar(6)\n  tenDonVi   String  @db.VarChar(50)\n  heSoQuyDoi Int\n  giaBan     Decimal @db.Decimal(18, 2)\n\n  sanPham     SanPham           @relation(fields: [maSanPham], references: [maSanPham], onDelete: Cascade)\n  lichSuGia   LichSuGiaBan[]\n  chiTietNhap ChiTietNhapHang[]\n  chiTietHD   ChiTietHoaDon[]\n  chiTietDT   ChiTietDoiTra[]\n}\n\nmodel LichSuGiaBan {\n  maLichSu        String   @id @db.VarChar(6)\n  maDonVi         String   @db.VarChar(6)\n  giaCu           Decimal  @db.Decimal(18, 2)\n  giaMoi          Decimal  @db.Decimal(18, 2)\n  thoiDiemThayDoi DateTime @default(now())\n\n  donVi DonViQuyDoi @relation(fields: [maDonVi], references: [maDonVi], onDelete: Cascade)\n}\n\nmodel PhieuNhapHang {\n  maPhieuNhap  String   @id @db.VarChar(6)\n  maNhaCungCap String   @db.VarChar(6)\n  ngayNhap     DateTime @default(now())\n  tongTien     Decimal  @db.Decimal(18, 2)\n\n  nhaCungCap   NhaCungCap        @relation(fields: [maNhaCungCap], references: [maNhaCungCap])\n  chiTietNhaps ChiTietNhapHang[]\n}\n\nmodel ChiTietNhapHang {\n  maChiTietNhap String    @id @db.VarChar(6)\n  maPhieuNhap   String    @db.VarChar(6)\n  maSanPham     String    @db.VarChar(6)\n  maDonViNhap   String    @db.VarChar(6)\n  tyLeQuyDoi    Int\n  soLuongNhap   Int\n  soLuongCon    Int       @default(0) // Số lượng còn (tính theo đơn vị cơ sở)\n  giaNhap       Decimal   @db.Decimal(18, 2)\n  thanhTien     Decimal   @db.Decimal(18, 2)\n  hanSuDung     DateTime?\n\n  phieuNhap       PhieuNhapHang          @relation(fields: [maPhieuNhap], references: [maPhieuNhap])\n  sanPham         SanPham                @relation(fields: [maSanPham], references: [maSanPham])\n  donViNhap       DonViQuyDoi            @relation(fields: [maDonViNhap], references: [maDonVi])\n  phieuDieuChinhs PhieuDieuChinhTonKho[]\n  phanBoXuatKhos  PhanBoXuatKho[]\n}\n\nmodel PhieuDieuChinhTonKho {\n  maPhieuDieuChinh String   @id @db.VarChar(6)\n  maSanPham        String   @db.VarChar(6)\n  maChiTietNhap    String   @db.VarChar(6)\n  ngayDieuChinh    DateTime @default(now())\n  soLuongCu        Int\n  soLuongMoi       Int\n  lyDo             String   @db.VarChar(250)\n  chenhLech        Int\n\n  sanPham     SanPham         @relation(fields: [maSanPham], references: [maSanPham])\n  chiTietNhap ChiTietNhapHang @relation(fields: [maChiTietNhap], references: [maChiTietNhap])\n}\n\nmodel KhachHang {\n  maKhachHang  String  @id @db.VarChar(6)\n  tenKhachHang String  @db.VarChar(50)\n  soDienThoai  String  @unique @db.VarChar(10)\n  diaChi       String? @db.VarChar(250)\n\n  hoaDons HoaDon[]\n}\n\nmodel HoaDon {\n  maHoaDon            String    @id @db.VarChar(6)\n  maKhachHang         String?   @db.VarChar(6)\n  ngayGioBan          DateTime  @default(now())\n  tongTien            Decimal   @db.Decimal(18, 2)\n  phuongThucThanhToan String    @db.VarChar(20)\n  tienKhachDua        Decimal?  @db.Decimal(18, 2)\n  tienThua            Decimal?  @db.Decimal(18, 2)\n  trangThai           String    @default(\"Đã thanh toán\") @db.VarChar(20)\n  lyDoHuy             String?   @db.VarChar(250)\n  thoiGianHuy         DateTime?\n\n  khachHang      KhachHang?      @relation(fields: [maKhachHang], references: [maKhachHang])\n  chiTietHoaDons ChiTietHoaDon[]\n  phieuDoiTras   PhieuDoiTra[]\n}\n\nmodel ChiTietHoaDon {\n  maChiTietHoaDon String  @id @db.VarChar(6)\n  maHoaDon        String  @db.VarChar(6)\n  maSanPham       String  @db.VarChar(6)\n  maDonViBan      String  @db.VarChar(6)\n  tyLeQuyDoi      Int\n  soLuong         Int\n  donGia          Decimal @db.Decimal(18, 2)\n  giaVonBinhQuan  Decimal @db.Decimal(18, 2)\n  thanhTien       Decimal @db.Decimal(18, 2)\n\n  hoaDon         HoaDon          @relation(fields: [maHoaDon], references: [maHoaDon])\n  sanPham        SanPham         @relation(fields: [maSanPham], references: [maSanPham])\n  donViBan       DonViQuyDoi     @relation(fields: [maDonViBan], references: [maDonVi])\n  phanBoXuatKhos PhanBoXuatKho[]\n  chiTietDoiTras ChiTietDoiTra[]\n}\n\nmodel PhieuDoiTra {\n  maPhieuDoiTra   String   @id @db.VarChar(6)\n  maHoaDon        String   @db.VarChar(6)\n  ngayGioDoiTra   DateTime @default(now())\n  tongTienHangTra Decimal  @db.Decimal(18, 2)\n  tongTienHangDoi Decimal  @db.Decimal(18, 2)\n  tienChenhLech   Decimal  @db.Decimal(18, 2)\n  trangThai       String   @default(\"Hoàn tất\") @db.VarChar(20)\n\n  hoaDon         HoaDon          @relation(fields: [maHoaDon], references: [maHoaDon])\n  chiTietDoiTras ChiTietDoiTra[]\n}\n\nmodel ChiTietDoiTra {\n  maChiTiet       String  @id @db.VarChar(6)\n  maPhieuDoiTra   String  @db.VarChar(6)\n  maChiTietHoaDon String? @db.VarChar(6)\n  maDonVi         String  @db.VarChar(6)\n  maSanPham       String  @db.VarChar(6)\n  maPhanBo        String? @db.VarChar(6)\n  loaiDong        String  @db.VarChar(20) // \"Hàng trả\", \"Hàng đổi\"\n  tyLeQuyDoi      Int\n  soLuong         Int\n  donGia          Decimal @db.Decimal(18, 2)\n  giaVonBinhQuan  Decimal @db.Decimal(18, 2)\n  thanhTien       Decimal @db.Decimal(18, 2)\n  duocNhapLaiKho  Boolean @default(true)\n\n  phieuDoiTra    PhieuDoiTra     @relation(fields: [maPhieuDoiTra], references: [maPhieuDoiTra])\n  chiTietHoaDon  ChiTietHoaDon?  @relation(fields: [maChiTietHoaDon], references: [maChiTietHoaDon])\n  donVi          DonViQuyDoi     @relation(fields: [maDonVi], references: [maDonVi])\n  sanPham        SanPham         @relation(fields: [maSanPham], references: [maSanPham])\n  phanBoXuatKhos PhanBoXuatKho[]\n}\n\nmodel PhanBoXuatKho {\n  maPhanBo        String  @id @db.VarChar(6)\n  maChiTietNhap   String  @db.VarChar(6)\n  maChiTietHoaDon String? @db.VarChar(6)\n  maChiTietDoiTra String? @db.VarChar(6)\n  soLuongXuat     Int // Số lượng xuất (theo đơn vị cơ sở)\n\n  chiTietNhap   ChiTietNhapHang @relation(fields: [maChiTietNhap], references: [maChiTietNhap])\n  chiTietHoaDon ChiTietHoaDon?  @relation(fields: [maChiTietHoaDon], references: [maChiTietHoaDon])\n  chiTietDoiTra ChiTietDoiTra?  @relation(fields: [maChiTietDoiTra], references: [maChiTiet])\n}\n\nmodel IdempotencyKey {\n  key       String   @id @db.VarChar(64)\n  action    String   @db.VarChar(50)\n  response  String?  @db.Text\n  createdAt DateTime @default(now())\n}\n",
  "inlineSchemaHash": "7af039d8ce71b7e7fda4ab016e46a459974d0b19ffa48bcbab979328e95047c5",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/client",
    "generated/client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"TaiKhoan\":{\"dbName\":null,\"fields\":[{\"name\":\"maTaiKhoan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenDangNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matKhau\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DanhMucSanPham\":{\"dbName\":null,\"fields\":[{\"name\":\"maDanhMuc\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenDanhMuc\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sanPhams\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SanPham\",\"relationName\":\"DanhMucSanPhamToSanPham\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"NhaCungCap\":{\"dbName\":null,\"fields\":[{\"name\":\"maNhaCungCap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenNhaCungCap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soDienThoai\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diaChi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"danhMuc\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trangThai\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"Đang hợp tác\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"moTa\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phieuNhaps\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhieuNhapHang\",\"relationName\":\"NhaCungCapToPhieuNhapHang\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SanPham\":{\"dbName\":null,\"fields\":[{\"name\":\"maSanPham\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenSanPham\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maDanhMuc\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maVach\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donViTinh\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giaNhapBinhQuan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuongTon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mucTonToiThieu\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quanLyHanSuDung\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trangThai\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"Đang kinh doanh\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"moTa\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"danhMuc\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DanhMucSanPham\",\"relationName\":\"DanhMucSanPhamToSanPham\",\"relationFromFields\":[\"maDanhMuc\"],\"relationToFields\":[\"maDanhMuc\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donViQuyDois\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DonViQuyDoi\",\"relationName\":\"DonViQuyDoiToSanPham\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietNhaps\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietNhapHang\",\"relationName\":\"ChiTietNhapHangToSanPham\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phieuDieuChinhs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhieuDieuChinhTonKho\",\"relationName\":\"PhieuDieuChinhTonKhoToSanPham\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietHoaDons\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietHoaDon\",\"relationName\":\"ChiTietHoaDonToSanPham\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietDoiTras\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietDoiTra\",\"relationName\":\"ChiTietDoiTraToSanPham\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DonViQuyDoi\":{\"dbName\":null,\"fields\":[{\"name\":\"maDonVi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maSanPham\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenDonVi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"heSoQuyDoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giaBan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sanPham\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SanPham\",\"relationName\":\"DonViQuyDoiToSanPham\",\"relationFromFields\":[\"maSanPham\"],\"relationToFields\":[\"maSanPham\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lichSuGia\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LichSuGiaBan\",\"relationName\":\"DonViQuyDoiToLichSuGiaBan\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietNhap\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietNhapHang\",\"relationName\":\"ChiTietNhapHangToDonViQuyDoi\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietHD\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietHoaDon\",\"relationName\":\"ChiTietHoaDonToDonViQuyDoi\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietDT\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietDoiTra\",\"relationName\":\"ChiTietDoiTraToDonViQuyDoi\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LichSuGiaBan\":{\"dbName\":null,\"fields\":[{\"name\":\"maLichSu\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maDonVi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giaCu\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giaMoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thoiDiemThayDoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donVi\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DonViQuyDoi\",\"relationName\":\"DonViQuyDoiToLichSuGiaBan\",\"relationFromFields\":[\"maDonVi\"],\"relationToFields\":[\"maDonVi\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PhieuNhapHang\":{\"dbName\":null,\"fields\":[{\"name\":\"maPhieuNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maNhaCungCap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ngayNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tongTien\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nhaCungCap\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"NhaCungCap\",\"relationName\":\"NhaCungCapToPhieuNhapHang\",\"relationFromFields\":[\"maNhaCungCap\"],\"relationToFields\":[\"maNhaCungCap\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietNhaps\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietNhapHang\",\"relationName\":\"ChiTietNhapHangToPhieuNhapHang\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ChiTietNhapHang\":{\"dbName\":null,\"fields\":[{\"name\":\"maChiTietNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maPhieuNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maSanPham\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maDonViNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tyLeQuyDoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuongNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuongCon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giaNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thanhTien\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hanSuDung\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phieuNhap\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhieuNhapHang\",\"relationName\":\"ChiTietNhapHangToPhieuNhapHang\",\"relationFromFields\":[\"maPhieuNhap\"],\"relationToFields\":[\"maPhieuNhap\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sanPham\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SanPham\",\"relationName\":\"ChiTietNhapHangToSanPham\",\"relationFromFields\":[\"maSanPham\"],\"relationToFields\":[\"maSanPham\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donViNhap\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DonViQuyDoi\",\"relationName\":\"ChiTietNhapHangToDonViQuyDoi\",\"relationFromFields\":[\"maDonViNhap\"],\"relationToFields\":[\"maDonVi\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phieuDieuChinhs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhieuDieuChinhTonKho\",\"relationName\":\"ChiTietNhapHangToPhieuDieuChinhTonKho\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phanBoXuatKhos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhanBoXuatKho\",\"relationName\":\"ChiTietNhapHangToPhanBoXuatKho\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PhieuDieuChinhTonKho\":{\"dbName\":null,\"fields\":[{\"name\":\"maPhieuDieuChinh\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maSanPham\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maChiTietNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ngayDieuChinh\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuongCu\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuongMoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lyDo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chenhLech\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sanPham\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SanPham\",\"relationName\":\"PhieuDieuChinhTonKhoToSanPham\",\"relationFromFields\":[\"maSanPham\"],\"relationToFields\":[\"maSanPham\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietNhap\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietNhapHang\",\"relationName\":\"ChiTietNhapHangToPhieuDieuChinhTonKho\",\"relationFromFields\":[\"maChiTietNhap\"],\"relationToFields\":[\"maChiTietNhap\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"KhachHang\":{\"dbName\":null,\"fields\":[{\"name\":\"maKhachHang\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenKhachHang\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soDienThoai\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diaChi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hoaDons\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HoaDon\",\"relationName\":\"HoaDonToKhachHang\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"HoaDon\":{\"dbName\":null,\"fields\":[{\"name\":\"maHoaDon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maKhachHang\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ngayGioBan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tongTien\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phuongThucThanhToan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tienKhachDua\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tienThua\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trangThai\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"Đã thanh toán\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lyDoHuy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thoiGianHuy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"khachHang\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"KhachHang\",\"relationName\":\"HoaDonToKhachHang\",\"relationFromFields\":[\"maKhachHang\"],\"relationToFields\":[\"maKhachHang\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietHoaDons\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietHoaDon\",\"relationName\":\"ChiTietHoaDonToHoaDon\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phieuDoiTras\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhieuDoiTra\",\"relationName\":\"HoaDonToPhieuDoiTra\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ChiTietHoaDon\":{\"dbName\":null,\"fields\":[{\"name\":\"maChiTietHoaDon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maHoaDon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maSanPham\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maDonViBan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tyLeQuyDoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuong\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donGia\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giaVonBinhQuan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thanhTien\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hoaDon\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HoaDon\",\"relationName\":\"ChiTietHoaDonToHoaDon\",\"relationFromFields\":[\"maHoaDon\"],\"relationToFields\":[\"maHoaDon\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sanPham\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SanPham\",\"relationName\":\"ChiTietHoaDonToSanPham\",\"relationFromFields\":[\"maSanPham\"],\"relationToFields\":[\"maSanPham\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donViBan\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DonViQuyDoi\",\"relationName\":\"ChiTietHoaDonToDonViQuyDoi\",\"relationFromFields\":[\"maDonViBan\"],\"relationToFields\":[\"maDonVi\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phanBoXuatKhos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhanBoXuatKho\",\"relationName\":\"ChiTietHoaDonToPhanBoXuatKho\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietDoiTras\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietDoiTra\",\"relationName\":\"ChiTietDoiTraToChiTietHoaDon\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PhieuDoiTra\":{\"dbName\":null,\"fields\":[{\"name\":\"maPhieuDoiTra\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maHoaDon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ngayGioDoiTra\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tongTienHangTra\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tongTienHangDoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tienChenhLech\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trangThai\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"Hoàn tất\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hoaDon\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HoaDon\",\"relationName\":\"HoaDonToPhieuDoiTra\",\"relationFromFields\":[\"maHoaDon\"],\"relationToFields\":[\"maHoaDon\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietDoiTras\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietDoiTra\",\"relationName\":\"ChiTietDoiTraToPhieuDoiTra\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ChiTietDoiTra\":{\"dbName\":null,\"fields\":[{\"name\":\"maChiTiet\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maPhieuDoiTra\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maChiTietHoaDon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maDonVi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maSanPham\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maPhanBo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loaiDong\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tyLeQuyDoi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuong\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donGia\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giaVonBinhQuan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thanhTien\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duocNhapLaiKho\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phieuDoiTra\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhieuDoiTra\",\"relationName\":\"ChiTietDoiTraToPhieuDoiTra\",\"relationFromFields\":[\"maPhieuDoiTra\"],\"relationToFields\":[\"maPhieuDoiTra\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietHoaDon\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietHoaDon\",\"relationName\":\"ChiTietDoiTraToChiTietHoaDon\",\"relationFromFields\":[\"maChiTietHoaDon\"],\"relationToFields\":[\"maChiTietHoaDon\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"donVi\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DonViQuyDoi\",\"relationName\":\"ChiTietDoiTraToDonViQuyDoi\",\"relationFromFields\":[\"maDonVi\"],\"relationToFields\":[\"maDonVi\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sanPham\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SanPham\",\"relationName\":\"ChiTietDoiTraToSanPham\",\"relationFromFields\":[\"maSanPham\"],\"relationToFields\":[\"maSanPham\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phanBoXuatKhos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PhanBoXuatKho\",\"relationName\":\"ChiTietDoiTraToPhanBoXuatKho\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PhanBoXuatKho\":{\"dbName\":null,\"fields\":[{\"name\":\"maPhanBo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maChiTietNhap\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maChiTietHoaDon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maChiTietDoiTra\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"soLuongXuat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietNhap\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietNhapHang\",\"relationName\":\"ChiTietNhapHangToPhanBoXuatKho\",\"relationFromFields\":[\"maChiTietNhap\"],\"relationToFields\":[\"maChiTietNhap\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietHoaDon\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietHoaDon\",\"relationName\":\"ChiTietHoaDonToPhanBoXuatKho\",\"relationFromFields\":[\"maChiTietHoaDon\"],\"relationToFields\":[\"maChiTietHoaDon\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiTietDoiTra\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChiTietDoiTra\",\"relationName\":\"ChiTietDoiTraToPhanBoXuatKho\",\"relationFromFields\":[\"maChiTietDoiTra\"],\"relationToFields\":[\"maChiTiet\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"IdempotencyKey\":{\"dbName\":null,\"fields\":[{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"response\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "src/generated/client/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/client/schema.prisma")
