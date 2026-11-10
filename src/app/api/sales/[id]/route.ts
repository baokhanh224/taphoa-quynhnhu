import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await getInvoiceById(params.id);
    if (!invoice) {
      return NextResponse.json({ error: 'Không tìm thấy hóa đơn phù hợp' }, { status: 404 });
    }
    return NextResponse.json({ invoice });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
