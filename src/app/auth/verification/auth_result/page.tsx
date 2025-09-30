'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import API from '@/../service/api';
import { LocalStorageItems } from '@/../shared/constants';
import { AxiosError } from 'axios';

import { showNoticeError } from '@/utils/custom/notice_error';

export default function NiceAuthResult() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const niceAuthCompleted = (isSuccess?: boolean) => {
    const redirect = localStorage.getItem(LocalStorageItems.AUTH_REDIRECT);
    router.push(`${redirect ?? '/?tabIndex=1'}${isSuccess ? '&authCompleted=1' : '&authCompleted=0'}`);

    const itemViewerLocalStorage = localStorage.getItem(LocalStorageItems.ITEM_VIEWER);
    const itemViewer = itemViewerLocalStorage ? JSON.parse(itemViewerLocalStorage) : undefined;
    if (itemViewer) localStorage.removeItem(LocalStorageItems.ITEM_VIEWER);
    localStorage.removeItem(LocalStorageItems.AUTH_REDIRECT);
  };

  const submitAuthResultAPI = useRef(
    new API('/api/v1/user/checkplus_success', 'GET', {
      success(data) {
        if (data.code == 200) {
          niceAuthCompleted(true);
        } else {
          showNoticeError('', data.message, false, '취소', '취소', () => {
            niceAuthCompleted(false);
          });
        }
        // niceAuthCompleted(true);
      },
      error(err: AxiosError<any>) {
        niceAuthCompleted();
      },
    }),
  );

  useEffect(() => {
    const encodeData = searchParams.get('EncodeData');
    if (encodeData) {
      submitAuthResultAPI.current.config.params = {
        EncodeData: encodeData,
      };
      submitAuthResultAPI.current.call();
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>인증 결과 확인 중...</div>
    </div>
  );
}
