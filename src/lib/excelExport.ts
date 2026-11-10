import ExcelJS from 'exceljs';
import { formatVND, formatDate } from './formatters';

export async function generateExcelReport(params: {
  title: string;
  reportType: string;
  filters: Record<string, string>;
  columns: Array<{ header: string; key: string; width?: number; isCurrency?: boolean }>;
  rows: any[];
  totals?: Record<string, number | string>;
}): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Tạp hóa Quỳnh Như';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Báo cáo');

  // Title row
  worksheet.mergeCells('A1', `${String.fromCharCode(64 + Math.max(params.columns.length, 4))}1`);
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'HỆ THỐNG QUẢN LÝ BÁN HÀNG TẠP HÓA QUỲNH NHƯ';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF166534' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 30;

  // Subtitle
  worksheet.mergeCells('A2', `${String.fromCharCode(64 + Math.max(params.columns.length, 4))}2`);
  const subCell = worksheet.getCell('A2');
  subCell.value = `${params.title.toUpperCase()} (${params.reportType})`;
  subCell.font = { name: 'Arial', size: 13, bold: true };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 24;

  // Filters summary
  let curRow = 4;
  worksheet.getCell(`A${curRow}`).value = 'Bộ lọc áp dụng:';
  worksheet.getCell(`A${curRow}`).font = { bold: true };
  curRow++;

  for (const [k, v] of Object.entries(params.filters)) {
    if (v) {
      worksheet.getCell(`A${curRow}`).value = `• ${k}: ${v}`;
      curRow++;
    }
  }

  curRow++; // empty line

  // Table headers
  const headerRowIdx = curRow;
  const headerRow = worksheet.getRow(headerRowIdx);
  params.columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF15803D' },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getColumn(idx + 1).width = col.width || 18;
  });
  headerRow.height = 25;

  curRow++;

  // Data rows
  params.rows.forEach((r) => {
    const row = worksheet.getRow(curRow);
    params.columns.forEach((col, idx) => {
      const cell = row.getCell(idx + 1);
      const val = r[col.key];
      if (col.isCurrency && typeof val === 'number') {
        cell.value = val;
        cell.numFmt = '#,##0 "đ"';
        cell.alignment = { horizontal: 'right' };
      } else if (typeof val === 'number') {
        cell.value = val;
        cell.alignment = { horizontal: 'right' };
      } else {
        cell.value = val !== undefined && val !== null ? String(val) : '';
        cell.alignment = { horizontal: 'left' };
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
    curRow++;
  });

  // Total row if present
  if (params.totals) {
    const totalRow = worksheet.getRow(curRow);
    params.columns.forEach((col, idx) => {
      const cell = totalRow.getCell(idx + 1);
      const val = params.totals?.[col.key];
      if (idx === 0) {
        cell.value = 'TỔNG CỘNG';
        cell.font = { bold: true };
      } else if (val !== undefined && val !== null) {
        if (typeof val === 'number' && col.isCurrency) {
          cell.value = val;
          cell.numFmt = '#,##0 "đ"';
          cell.alignment = { horizontal: 'right' };
        } else {
          cell.value = val;
          cell.alignment = { horizontal: 'right' };
        }
        cell.font = { bold: true };
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF1F5F9' },
      };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF94A3B8' } },
        bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
      };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
