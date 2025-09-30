import { getApiBaseUrl } from "../function/common";

export const ENV: 'dev' | 'prod' = 'prod';

export const BASE_BACK_URL = ENV === 'prod' ? 'beauty-api.vodaplay.co' : 'vodaplay-dev.site/backend';
export const BASE_UPLOAD_URL = ENV === 'prod' ? 'beauty-api.vodaplay.co/upload' : 'vodaplay-dev.site/upload';

export const BASE_URL = getApiBaseUrl();

export const COMMON_ERROR_MSG = '알 수 없는 오류가 발생했습니다.';
