'use client';

import { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = 'wnXG-eTK4beFuT3j6v7JH';

export default function BillingPage() {
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: 50_000,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgetsInstance = tossPayments.widgets({ customerKey });
      setWidgets(widgetsInstance);
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;

      await widgets.setAmount(amount);

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        }),
        widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (!widgets) return;
    widgets.setAmount(amount);
  }, [amount, widgets]);

  return (
    <div className="wrapper p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">결제 페이지</h1>

      <div className="box_section border rounded-md p-4">
        {/* 결제 UI */}
        <div id="payment-method" className="mb-4" />

        {/* 이용약관 UI */}
        <div id="agreement" className="mb-4" />

        {/* 쿠폰 체크박스 */}
        <div className="mb-4">
          <label htmlFor="coupon-box" className="flex items-center gap-2">
            <input
              id="coupon-box"
              type="checkbox"
              disabled={!ready}
              onChange={(e) => {
                const checked = e.target.checked;
                setAmount((prev) => ({
                  ...prev,
                  value: checked ? prev.value - 5_000 : prev.value + 5_000,
                }));
              }}
            />
            <span>5,000원 쿠폰 적용</span>
          </label>
        </div>

        {/* 결제하기 버튼 */}
        <button
          className="button w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={!ready}
          onClick={async () => {
            try {
              await widgets.requestPayment({
                orderId: 'vaCCpa9vQk659krsTnnbo',
                orderName: '토스 티셔츠 외 2건',
                successUrl: `${window.location.origin}/bilingsuccess`,
                failUrl: `${window.location.origin}/bilingfalse`,
                customerEmail: 'customer123@gmail.com',
                customerName: '김토스',
                customerMobilePhone: '01012341234',
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
