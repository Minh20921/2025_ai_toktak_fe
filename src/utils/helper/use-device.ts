export enum Device {
  IOS,
  ANDROID,
  OTHER,
}
export function useDeviceOS() {
  if (window.navigator.userAgent.includes('iPhone')) return Device.IOS;
  if (window.navigator.userAgent.includes('Android')) return Device.ANDROID;
  return Device.OTHER;
}
export function useAppDevice() {
  if (window.navigator.userAgent.includes('iPhone')) return true;
  if (window.navigator.userAgent.includes('Android')) return true;
  return false;
}
