import axios from 'axios';
import { UserTypes } from '../contexts/authContext';
import { saveAPILogging } from '../function/common';
import { BASE_URL } from './config';

declare const window: any;
const callbackList: Array<(...agrs: any[]) => void> = [];

async function onErrorAccessTokenRefresh(loadMobileToken = true, callback: (...agrs: any[]) => void) {
  window.loadLoginDataWithMobileDBCallbackRefresh = loadLoginDataWithMobileDBCallbackRefresh;
  const refreshToken = localStorage.getItem('refresh-token');

  if (refreshToken) {
    callbackList.push(callback);
    onRefreshToken(refreshToken);
    return;
  } else if (loadMobileToken) {
    const isLoadTokenInDevice = loadLoginDataWithMobileDB();
    if (!isLoadTokenInDevice) {
      callback(false);
    } else callbackList.push(callback);
    return;
  }
  callback(false);
}

// 로그인 정보 조회
const loadLoginDataWithMobileDB = (): boolean => {
  if (typeof window.AndroidScript != 'undefined' && window.AndroidScript?.getNativeLoginTokenData) {
    const _access = window.AndroidScript.getNativeLoginTokenData(0);
    const _refresh = window.AndroidScript.getNativeLoginTokenData(1);
    loadLoginDataWithMobileDBCallbackRefresh(_access, _refresh);
    saveAPILogging(
      'loadLoginDataWithMobileDBCallbackRefresh',
      { platform: 'Android' },
      { acess_token: _access, refresh_token: _refresh },
    );
    return true;
  }

  try {
    window.webkit.messageHandlers.loadLoginDataWithMobileDB.postMessage('refresh');
    saveAPILogging('loadLoginDataWithMobileDB', { platform: 'IOS' }, { type: 'refresh' });
    return true;
  } catch {}

  return false;
};

// 로그인 정보 조회 Callback
const loadLoginDataWithMobileDBCallbackRefresh = async (access: string, refresh: string) => {
  saveToken(access, UserTypes.MEMBER, refresh, false);
  saveAPILogging('loadLoginDataWithMobileDBCallbackRefresh', { platform: 'IOS' }, { access, refresh });
  if (refresh) onRefreshToken(refresh, true);
};

/*
 * Native DataBase + Webview Login
 */
// 로그인 정보 저장
export const saveLoginDataWithMobileDB = (access: string, refresh: string) => {
  // Andriod SQLite 데이터 저장
  if (typeof window.AndroidScript != 'undefined' && window.AndroidScript?.setNativeLoginTokenData) {
    window.AndroidScript.setNativeLoginTokenData(access, refresh);
    saveAPILogging('saveLoginDataWithMobileDB', { platform: 'Android' }, { access, refresh });
  }

  // IOS UserDefaults 데이터 저장
  try {
    window.webkit.messageHandlers.saveAccessToken.postMessage(access);
    saveAPILogging('saveAccessToken', { platform: 'IOS' }, { access });
  } catch {}

  try {
    window.webkit.messageHandlers.saveRefreshToken.postMessage(refresh);
    saveAPILogging('saveRefreshToken', { platform: 'IOS' }, { refresh });
  } catch {}
};

async function onRefreshToken(refreshToken: string, isLoadTokenInDevice = false) {
  const url = window.location.pathname;
  const type = url.startsWith('/admin')
    ? UserTypes.ADMIN
    : url.startsWith('/business')
      ? UserTypes.BUSINESS
      : UserTypes.MEMBER;

  const requestConfig = {
    url: `${BASE_URL}/token/refresh`,
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + refreshToken,
    },
  };
  const callback = callbackList.shift();
  await axios(requestConfig)
    .then((res) => {
      saveToken(res.data.token, res.data.type, res.data.refresh_token);
      saveAPILogging('/token/refresh', requestConfig, res);
      callback && callback(res);
    })
    .catch((err) => {
      callback && callback(false);
      saveAPILogging('/token/refresh', requestConfig, err);
      if (isLoadTokenInDevice === false) {
        sessionStorage.removeItem('token');
        localStorage.removeItem('refresh-token');
        if (type == UserTypes.ADMIN) {
          window.location.replace('/admin/form');
          return;
        } else if (type == UserTypes.BUSINESS) {
          window.location.replace('/business/form');
          return;
        } else if (type == UserTypes.MEMBER) {
          window.location.replace('/user/form');
          return;
        } else {
          window.location.replace('/user');
        }
      }
    })
    .finally(() => {});
}

function saveToken(token: string, type: UserTypes, refreshToken: string, saveOnMobile = true) {
  // const url = window.location.pathname
  // const type = url.startsWith("/user") ? 0 : url.startsWith("/business") ? 1 : 99
  sessionStorage.setItem('token', JSON.stringify({ type, token }));
  localStorage.setItem('refresh-token', refreshToken);
  saveOnMobile && saveLoginDataWithMobileDB(token, refreshToken);
}

const removeToken = (redriect?: boolean) => {
  const token = sessionStorage.getItem('token');

  if (typeof window.AndroidScript != 'undefined' && window.AndroidScript?.getNativeLoginTokenData) {
    window.AndroidScript.removeLoginToken();
  }

  try {
    window.webkit.messageHandlers.removeLoginToken.postMessage('');
  } catch (err) {}

  sessionStorage.removeItem('token');
  localStorage.removeItem('refresh-token');

  if (token && redriect) {
    const { type } = JSON.parse(token);
    if (type === 99) window.location.replace('/admin/form');
    else if (type === 1) window.location.replace('/business/form');
    else window.location.replace('/user/form');
  }
};

export const TokenManager = {
  onErrorAccessTokenRefresh,
  onRefreshToken,
  saveToken,
  removeToken,
};
