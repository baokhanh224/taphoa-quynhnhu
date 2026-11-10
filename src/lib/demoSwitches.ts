import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface DemoSwitches {
  errorSave: boolean;     // Giả lập lỗi lưu CSDL
  errorLoad: boolean;     // Giả lập lỗi tải dữ liệu
  errorPrinter: boolean;  // Giả lập lỗi máy in
}

export const DEMO_SWITCH_COOKIE = 'demo_switches';

export function getDemoSwitchesFromCookies(cookieHeader?: string | null): DemoSwitches {
  const defaults: DemoSwitches = {
    errorSave: false,
    errorLoad: false,
    errorPrinter: false,
  };

  if (!cookieHeader) return defaults;
  try {
    const match = cookieHeader.match(new RegExp(`(?:^|; )${DEMO_SWITCH_COOKIE}=([^;]*)`));
    if (match && match[1]) {
      const parsed = JSON.parse(decodeURIComponent(match[1]));
      return {
        errorSave: Boolean(parsed.errorSave),
        errorLoad: Boolean(parsed.errorLoad),
        errorPrinter: Boolean(parsed.errorPrinter),
      };
    }
  } catch {}
  return defaults;
}

export function getDemoSwitches(req?: NextRequest): DemoSwitches {
  const defaults: DemoSwitches = {
    errorSave: false,
    errorLoad: false,
    errorPrinter: false,
  };

  // Check URL query param first (e.g. ?simulate_error=save or ?simulate_error=load)
  if (req) {
    const url = new URL(req.url);
    const param = url.searchParams.get('demo_error');
    if (param === 'save') return { ...defaults, errorSave: true };
    if (param === 'load') return { ...defaults, errorLoad: true };
    if (param === 'printer') return { ...defaults, errorPrinter: true };

    const cookieHeader = req.headers.get('cookie');
    return getDemoSwitchesFromCookies(cookieHeader);
  }

  try {
    const cookieStore = cookies();
    const val = cookieStore.get(DEMO_SWITCH_COOKIE)?.value;
    if (val) {
      const parsed = JSON.parse(decodeURIComponent(val));
      return {
        errorSave: Boolean(parsed.errorSave),
        errorLoad: Boolean(parsed.errorLoad),
        errorPrinter: Boolean(parsed.errorPrinter),
      };
    }
  } catch {}

  return defaults;
}
