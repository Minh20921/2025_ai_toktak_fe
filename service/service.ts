import { AxiosError, Method } from 'axios';

export interface ServiceConfigModel {
  autoCancel?: boolean;
  loadingBlock?: boolean;
  loginCheck?: boolean;
  isForm?: boolean;
  delayTime?: number;
}

export interface ServiceGetConfigModel<T> extends ServiceConfigModel {
  params?: T;
  data?: any;
}

export interface ServicePostConfigModel<T> extends ServiceConfigModel {
  data?: T;
  params?: undefined;
}

export interface ErrorModel {
  code: number;
  msg: string;
  isCancel: boolean;
  isAxiosError: boolean;
}

export interface CallbackModel {
  success: (data: any, customData?: any) => void;
  error?: (err: AxiosError) => void;
  finally?: () => void;
}

export interface Cancel {
  message: string | undefined;
}

export interface Canceler {
  (message?: string): void;
}

export interface CancelTokenStatic {
  new (executor: (cancel: Canceler) => void): CancelToken;
  source(): CancelTokenSource;
}

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

export interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}

abstract class Service<T> {
  abstract url: string;

  abstract method: Method | undefined;

  abstract config: ServiceGetConfigModel<T> | ServicePostConfigModel<T>;

  abstract cancelToken: CancelTokenSource | null;

  abstract loading: boolean;

  abstract callback?: CallbackModel | null;

  abstract delayTime: number;

  abstract customData: any;

  abstract set(config: ServiceGetConfigModel<T> | ServicePostConfigModel<T>): void;

  abstract call(customData: any): Promise<void>;

  abstract cancel(): void;

  abstract getAccessHeader(refreshToken?: string, isForm?: boolean): Record<string, string>;
}

export default Service;
