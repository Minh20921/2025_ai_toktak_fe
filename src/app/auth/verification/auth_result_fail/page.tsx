'use client';
import { AxiosError } from 'axios';
// import SVG from "components/Common/SVG"
// import UserContainer from "components/User/Container"
// import { getResponseErrorMsgKey } from "function/common"
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
// import { useTranslation } from "react-i18next"
// import { useSetRecoilState } from "recoil"
import API from '@/../service/api';
// import ApiV2 from "service/api_v2"
import { LocalStorageItems } from '@/../shared/constants';

export default function NiceAuthResultFail() {
  const router = useRouter();
  // const setCustomAlert = useSetRecoilState(alertState)
  // const setItemViewer = useSetItemViewer()
  // const { t } = useTranslation()

  const niceAuthCompleted = (isSuccess?: boolean) => {
    const redirect = localStorage.getItem(LocalStorageItems.AUTH_REDIRECT);
    router.push(`${redirect ?? '/user'}${isSuccess ? '?authCompleted=1' : ''}`);
    const itemViewerLocalStorage = localStorage.getItem(LocalStorageItems.ITEM_VIEWER);
    const itemViewer = itemViewerLocalStorage ? JSON.parse(itemViewerLocalStorage) : undefined;
    // setItemViewer(itemViewer)
    if (itemViewer) localStorage.removeItem(LocalStorageItems.ITEM_VIEWER);
    localStorage.removeItem(LocalStorageItems.AUTH_REDIRECT);
  };

  // const pushNotificationKakao = (mobileno: string) => {
  //   const verifyPhoneKakao = new ApiV2("/admin/kakao/send-kakao-talk-when-confirm-phone", "POST", {
  //     success() {
  //       //
  //     },
  //   })

  //   verifyPhoneKakao.config.data = { phone: mobileno }
  //   verifyPhoneKakao.call()
  // }

  const submitAuthResultAPI = useRef(
    new API('/api/v1/user/checkplus_fail', 'GET', {
      success(data) {
        // pushNotificationKakao(data.mobileno)
        // setCustomAlert({
        //   isShow: true,
        //   Icon: (
        //     <div className="mb-4 flex items-center justify-center">
        //       <SVG fill="#1EC5C1" height={50} width={50} name="icon-check-circle" />
        //     </div>
        //   ),
        //   title: <h4 className="font-bold text-mint">{t("I18N_AUTHENTICATION_SUCCESS")}</h4>,
        //   content: t("I18N_IDENTITY_VERIFICATION_COMPLETED"),
        //   type: "alert",
        //   okText: t("I18N_CONFIRM") ?? "확인",
        //   okCallback: () => {
        //     niceAuthCompleted(true)
        //   },
        // })
        niceAuthCompleted(true);
      },
      error(err: AxiosError<any>) {
        // setCustomAlert({
        //   isShow: true,
        //   Icon: (
        //     <div className="mb-4 flex items-center justify-center">
        //       <SVG fill="#39404A" height={50} width={50} name="icon-warning" />
        //     </div>
        //   ),
        //   title: <h4 className="text-[#39404A]">{t("I18N_AUTHENTICATION_FAILED")}</h4>,
        //   content: t(getResponseErrorMsgKey(err)),
        //   type: "alert",
        //   okText: t("I18N_CONFIRM") ?? "확인",
        //   okCallback: () => {
        //     niceAuthCompleted()
        //   },
        // })
        niceAuthCompleted();
      },
    }),
  );

  useEffect(() => {
    if (router.query?.EncodeData) {
      submitAuthResultAPI.current.config.params = {
        EncodeData: router.query?.EncodeData,
      };
      submitAuthResultAPI.current.call();
    }
  }, [router.query]);
  return (
    // <UserContainer>
    <div className="flex h-screen w-full items-center justify-center">
      <div></div>
    </div>
    // </UserContainer>
  );
}
