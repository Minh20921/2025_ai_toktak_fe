import axios, { AxiosError, CancelTokenSource, Method } from 'axios';
import { G_getAccessHeader } from '../function/api';
import { formGenerator, saveAPILogging, getApiBaseUrl } from '../function/common';
import Service, { CallbackModel, ServiceGetConfigModel, ServicePostConfigModel } from './service';
import { TokenManager } from './token-refresh';
import { saveAs } from 'file-saver';
import { REFRESH_TOKEN, TOKEN_LOGIN } from '@/utils/constant';
import Cookies from 'js-cookie';
import { refreshTokenService } from '@/app/lib/service';

class API<T> implements Service<T> {
  url = '';

  method: Method | undefined = undefined;

  config: ServiceGetConfigModel<T> | ServicePostConfigModel<T> = {};

  cancelToken: CancelTokenSource | null = null;

  loading = false;

  callback: CallbackModel | null = null;

  delayTime = 500;

  customData: any = undefined;
  controller: AbortController;
  refreshToken: string | undefined = undefined;

  constructor(url: string, method: Method, callback: CallbackModel) {
    this.controller = new AbortController();
    this.url = url;
    this.method = method;
    this.callback = callback;
  }

  async call(customData?: any) {
    if (this.config.loadingBlock && this.loading) return;

    if (this.config.autoCancel) {
      // this.cancel()
    }

    this.customData = customData;
    this.loading = true;
    axios.defaults.baseURL = getApiBaseUrl();

    const isForm = !!this.config.isForm;

    const requestConfig = {
      signal: this.controller.signal,
      url: this.url,
      method: this.method,
      cancelToken: this.cancelToken?.token,
      params: this.config.params ?? undefined,
      data: this.config.data ? (isForm ? formGenerator(this.config.data) : this.config.data) : undefined,
      headers: this.getAccessHeader(this.refreshToken, isForm), // ✅ truyền isForm vào
    };

    const callTime = new Date().getTime();

    await axios(requestConfig)
      .then((res: { status: number; data: any }) => {
        if (res.status === 200) {
          const data = res.data;
          this.callback?.success(data, customData);
          saveAPILogging(this.url, { ...requestConfig, callTime, endTime: new Date().getTime() }, res);
        } else {
          throw res.data;
        }
      })
      .catch((err: AxiosError) => {
        if (err?.response?.status === 401) {
          const currentRefreshToken = Cookies.get(REFRESH_TOKEN);
          if (currentRefreshToken) {
            refreshTokenService(currentRefreshToken).then((res) => {
              if (res) {
                Cookies.set(TOKEN_LOGIN, res.data.access_token, { expires: 30 });
                Cookies.set(REFRESH_TOKEN, res.data.refresh_token, { expires: 30 });
              } else {
                Cookies.remove(TOKEN_LOGIN);
                Cookies.remove(REFRESH_TOKEN);
              }
              window.location.reload();
            });
          }
        }

        if (err?.response?.status === 423) {
          saveAPILogging(this.url, { ...requestConfig, callTime, endTime: new Date().getTime() }, err);
          TokenManager.onErrorAccessTokenRefresh(true, async (res) => {
            if (res) await this.call();
          });
        } else if (this.callback?.error) {
          this.callback.error(err);
          saveAPILogging(this.url, { ...requestConfig, callTime, endTime: new Date().getTime() }, err);
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, this.config.delayTime ?? this.delayTime);

        this.callback?.finally?.();
      });
  }

  set(config: ServicePostConfigModel<T> | ServiceGetConfigModel<T>) {
    this.config = config;
    return this;
  }

  setUrl(url: string) {
    this.url = url;
  }

  setMethod(method: Method | undefined) {
    this.method = method;
  }

  cancel() {
    this.controller.abort();
    this.controller = new AbortController();
  }

  getAccessHeader(refreshToken?: string, isForm: boolean = false) {
    return G_getAccessHeader(refreshToken, isForm);
  }

  async download(filename?: string) {
    this.loading = true;

    try {
      axios.defaults.baseURL = getApiBaseUrl();

      let requestConfig = {
        url: this.url,
        method: this.method,
        responseType: 'blob', // Quan trọng để nhận file
        signal: this.controller.signal,
        headers: this.getAccessHeader(this.refreshToken),
        params: this.config.params ?? undefined,
        data: this.config.data ?? undefined,
      };

      const res = await axios(requestConfig);

      // Lấy tên file từ Content-Disposition nếu không truyền vào
      const disposition = res.headers['content-disposition'];
      const suggestedFilename =
        filename || (disposition && disposition.split('filename=')[1]?.replaceAll('"', '')?.trim()) || 'download.zip';

      saveAs(res.data, suggestedFilename);

      this.callback?.success?.(res.data, this.customData);
    } catch (err: any) {
      this.callback?.error?.(err);
    } finally {
      this.loading = false;
      this.callback?.finally?.();
    }
  }
}

export default API;
