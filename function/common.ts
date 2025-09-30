/* eslint-disable no-useless-escape */

import { LocalStorageItems } from '../shared/constants';

type ObjectType = { [key: string]: any };

export const formGenerator = (body: any) => {
  const formData = new FormData();

  function appendFormData(formData: FormData, data: any, parentKey = '') {
    if (Array.isArray(data)) {
      data.forEach((value, idx) => {
        appendFormData(formData, value, `${parentKey}[${idx}]`);
      });
    } else if (typeof data === 'object' && data !== null && !(data instanceof File)) {
      Object.entries(data).forEach(([key, value]) => {
        appendFormData(formData, value, parentKey ? `${parentKey}[${key}]` : key);
      });
    } else if (data !== undefined && data !== null) {
      formData.append(parentKey, data);
    }
  }

  appendFormData(formData, body);
  return formData;
};

export function saveAPILogging(endpoint: string, request: any, response: any) {
  const isRecord = localStorage.getItem(LocalStorageItems.API_LOGGING_RECORD);
  if (+(isRecord ?? 0) === 0) return;
  const data = localStorage.getItem(LocalStorageItems.API_LOGGING);
  const dataArray = JSON.parse(data ?? '[]');
  const newDataArray = [
    {
      endpoint,
      request,
      response,
    },
    ...dataArray,
  ];
  if (newDataArray.length > 200) newDataArray.pop();
  localStorage.setItem(LocalStorageItems.API_LOGGING, JSON.stringify(newDataArray));
}

export const G_commaDecimal = (number: number): string => {
  if (isNaN(number)) number = 0;

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};



export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.includes("voda-play.com")) {
      return process.env.NEXT_PUBLIC_API_BASE_URL_VODA ?? "http://127.0.0.1:6002";
    } else {
      return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:6002";
    }
  } else {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:6002";
  }
}

export function getURLGoogle(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.includes("voda-play.com")) {
      return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI_VODA ?? "http://127.0.0.1:6002";
    } else {
      return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "http://127.0.0.1:6002";
    }
  } else {
    return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "http://127.0.0.1:6002";
  }
}


export function getLogoText(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.includes("voda-play.com")) {
      return process.env.LOGO_TEXT_VODA?? "http://127.0.0.1:6002";
    } else {
      return process.env.LOGO_TEXT ?? "TOKTAK";
    }
  } else {
    return process.env.LOGO_TEXT || "TOKTAK";
  }
}