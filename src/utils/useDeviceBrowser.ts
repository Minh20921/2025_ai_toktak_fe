export function useInvalidDevice() {
  if (typeof window !== 'undefined') {
    if (window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('Android'))
      return true;
  }
  return false;
}

export function useInvalidBrowser() {
  if (typeof window !== 'undefined') {
    const brands = window.navigator?.userAgentData?.brands || [];
    const useChrome = brands.some((item) => item.brand === 'Google Chrome');
    if (window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('Android') || !useChrome)
      return true;
  }
  return false;
}
