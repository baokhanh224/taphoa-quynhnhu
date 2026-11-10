import { NextRequest, NextResponse } from 'next/server';
import { cancelInvoice } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const switches = getDemoSwitches(req);
  // UC6.3 7a.1: Không thể hủy hóa đơn
  if (switches.errorSave) {
    return NextResponse.json({ error: 'Không thể hủy hóa đơn' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { lyDoHuy, idempotencyKey } = body;

    // UC6.3 6a.1: Chưa nhập lý do hủy
    if (!lyDoHuy || !lyDoHuy.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập lý do hủy hóa đơn' },
        { status: 400 }
      );
    }

    await cancelInvoice(params.id, lyDoHuy.trim(), idempotencyKey);

    return NextResponse.json({
      success: true,
      message: 'Hủy hóa đơn thành công',
    });
  } catch (err: any) {
    // Return exact business messages
    if (
      err.message === 'Hóa đơn này đã được hủy trước đó' ||
      err.message === 'Hóa đơn có giao dịch đổi/trả hàng, không thể hủy trực tiếp' ||
      err.message === 'Hóa đơn không tồn tại'
    ) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Không thể hủy hóa đơn' }, { status: 500 });
  }
}
