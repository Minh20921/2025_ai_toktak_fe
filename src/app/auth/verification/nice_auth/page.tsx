'use client';
import { useCurrentUser } from "@/../contexts/authContext"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import API from "@service/api"
import { LocalStorageItems } from '@/../shared/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';

type AuthDataType = {
  m?: string
  encodeData?: string
  endpoint?: string
}

function NiceAuth() {
  const niceAuthFormRef = useRef<any>(null)
  const currentUser = useSelector((state: RootState) => state.auth);
  const router = useRouter()
  const [authData, setAuthData] = useState<AuthDataType>()

  const getVerifyDataAPI = useRef(
    new API("/api/v1/user/nice_auth", "GET", {
      success: (res: any) => {
        setAuthData({
          m: res?.data?.m,
          encodeData: res?.data?.EncodeData,
          endpoint: res?.data?.endpoint,
        })
      },
    })
  )

  useEffect(() => {
    if (authData?.encodeData) {
      niceAuthFormRef.current.submit()
    }
  }, [authData?.encodeData])

  useEffect(() => {
    if (!currentUser?.is_auth_nice) getVerifyDataAPI.current.call()
  }, [currentUser])

  useEffect(() => {
    if (router?.query?.redirect) {
      localStorage.setItem(LocalStorageItems.AUTH_REDIRECT, `${router?.query?.redirect}`)
    }
  }, [router?.query])

  return (
    <div>
      <form name="form_chk" ref={niceAuthFormRef} method="post" action={authData?.endpoint}>
        <input type="hidden" name="m" value={authData?.m} />
        <input type="hidden" name="EncodeData" value={authData?.encodeData} />
        <input type="hidden" name="recvMethodType" value="get"></input>
      </form>
    </div>
  );
};

export default NiceAuth;
