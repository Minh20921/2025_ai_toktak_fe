export const maskCreditCard = (cardNumber: string): string => {
  if (!cardNumber) return '';
  return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
};

// Shared number/currency formatters for KR locale
const numberFormatterKR = new Intl.NumberFormat('ko-KR');
const currencyFormatterKRW = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
});

export const formatNumberKR = (value: number | string | null | undefined): string => {
  const numericValue = Number(value || 0);
  return numberFormatterKR.format(numericValue);
};

export const formatKRW = (value: number | string | null | undefined): string => {
  const numericValue = Number(value || 0);
  return currencyFormatterKRW.format(numericValue);
};

export const formatKRWWithWon = (value: number | string | null | undefined): string => {
  return `${formatNumberKR(value)}원`;
};
