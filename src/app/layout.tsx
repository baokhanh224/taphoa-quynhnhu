import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hệ thống quản lý bán hàng tạp hóa Quỳnh Như',
  description: 'Website Quản lý bán hàng Tạp hóa Quỳnh Như - Đồ án thực tập nhóm',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-100 flex flex-col">{children}</body>
    </html>
  );
}
