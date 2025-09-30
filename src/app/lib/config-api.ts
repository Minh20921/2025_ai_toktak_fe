import { getApiBaseUrl } from '../../../function/common';

const BASE_URL = getApiBaseUrl();
const DEFAULT_MAINTENANCE_TIME = process.env.NEXT_PUBLIC_MAINTENANCE_TIME || '18:00 ~ 21:00';

export async function getConfig(): Promise<{
  IS_MAINTANCE: string;
  MAINTANCE_DESCRIPTION: string;
  notification_detail: {
    country: string;
    title: string;
    url: string;
    description: string;
    icon: string;
    icon_url: string;
    redirect_type: string;
    ask_again: number;
    repeat_duration: number;
    button_oke: string;
    button_cancel: string;
    popup_type: string;
    toasts_color: string;
  };
}> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/setting/get_public_config`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch config data');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일(${['일', '월', '화', '수', '목', '금', '토'][now.getDay()]})`;

    return {
      IS_MAINTANCE: '0',
      MAINTANCE_DESCRIPTION: `${formattedDate} ${DEFAULT_MAINTENANCE_TIME} 까지`,
      notification_detail: {} as any,
    };
  }
}
