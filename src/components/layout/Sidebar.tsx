'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Receipt,
  Package,
  Truck,
  Users,
  PackagePlus,
  Sliders,
  AlertCircle,
  FileText,
  TrendingUp,
  Boxes,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuSections = [
    {
      title: 'BÁN HÀNG TẠI QUẦY',
      items: [
        {
          label: 'Tạo giao dịch bán hàng',
          href: '/pos',
          icon: ShoppingCart,
          badge: 'UC6.1',
        },
        {
          label: 'Lịch sử bán hàng',
          href: '/sales/history',
          icon: Receipt,
          badge: 'UC6.4',
        },
      ],
    },
    {
      title: 'HÀNG HÓA & ĐỐI TÁC',
      items: [
        {
          label: 'Quản lý sản phẩm',
          href: '/products',
          icon: Package,
          badge: 'UC1',
        },
        {
          label: 'Quản lý nhà cung cấp',
          href: '/suppliers',
          icon: Truck,
          badge: 'UC2',
        },
        {
          label: 'Quản lý khách hàng',
          href: '/customers',
          icon: Users,
          badge: 'UC5',
        },
      ],
    },
    {
      title: 'QUẢN LÝ TỒN KHO',
      items: [
        {
          label: 'Nhập hàng',
          href: '/inventory/import',
          icon: PackagePlus,
          badge: 'UC4.1',
        },
        {
          label: 'Điều chỉnh tồn kho',
          href: '/inventory/adjust',
          icon: Sliders,
          badge: 'UC4.2',
        },
        {
          label: 'Tra cứu tồn kho & cảnh báo',
          href: '/inventory/inquiry',
          icon: AlertCircle,
          badge: 'UC4.3',
        },
        {
          label: 'Lịch sử nhập hàng',
          href: '/inventory/history',
          icon: FileText,
          badge: 'UC4.4',
        },
      ],
    },
    {
      title: 'BÁO CÁO THỐNG KÊ',
      items: [
        {
          label: 'Báo cáo kinh doanh',
          href: '/reports/business',
          icon: TrendingUp,
          badge: 'UC3.1',
        },
        {
          label: 'Báo cáo xuất – nhập – tồn',
          href: '/reports/inventory',
          icon: Boxes,
          badge: 'UC3.2',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50 text-center">
        <p className="text-[11px] text-slate-500 font-medium">Hệ thống Quỳnh Như POS</p>
        <p className="text-[10px] text-slate-400">Đầy đủ 25 Use Cases đặc tả</p>
      </div>
    </aside>
  );
}
