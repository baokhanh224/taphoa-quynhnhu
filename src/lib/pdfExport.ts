import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatVND } from './formatters';

export function generatePdfReport(params: {
  title: string;
  reportType: string;
  filters: Record<string, string>;
  headers: string[];
  data: (string | number)[][];
  totals?: (string | number)[];
}): Buffer {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(16);
  doc.setTextColor(21, 128, 61); // green-700
  doc.text('HỆ THỐNG QUẢN LÝ BÁN HÀNG TẠP HÓA QUỲNH NHƯ', 14, 15);

  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(`${params.title} (${params.reportType})`, 14, 23);

  // Filters
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  let filterY = 30;
  for (const [k, v] of Object.entries(params.filters)) {
    if (v) {
      doc.text(`${k}: ${v}`, 14, filterY);
      filterY += 5;
    }
  }

  const tableBody = [...params.data];
  if (params.totals) {
    tableBody.push(params.totals);
  }

  autoTable(doc, {
    startY: filterY + 3,
    head: [params.headers],
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [21, 128, 61],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    didParseCell: function (data) {
      // Bold last row if it's total row
      if (params.totals && data.row.index === tableBody.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [241, 245, 249];
      }
    },
  });

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
