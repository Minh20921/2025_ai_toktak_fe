'use client';
import React, { useState, useEffect, useRef } from 'react';
import StartRenderVideo from '../../components/dashboard/StartRenderVideo';
import AnalysProduct from '../../components/dashboard/AnalysProduct';
import { useSearchParams } from 'next/navigation';
import APIV2 from '@service/api_v2';
import NewUserWellcomePopup from '../components/popup/NewUserWellcomePopup';

const Page = () => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(-1);
  const [producUrl, setProducUrl] = useState('');
  const [adsEnabled, setAdsEnabled] = useState<boolean>(true);
  const [narration, setNarration] = useState<string>('female');
  const [audios, setAudios] = useState<any[]>([]);
  const [openNewUserAlert, setOpenNewUserAlert] = useState(false);

  useEffect(() => {
    const batchId = searchParams.get('batchId');
    const sampleId = searchParams.get('sampleId');
    if (batchId || sampleId) {
      setStep(1);
      setProducUrl('');
    } else {
      setStep(0);
    }
  }, [searchParams]);

  useEffect(() => {
    new APIV2('/api/v1/notification/view_website', 'GET', {
      success: (res) => {
      },
      error: (err) => { },
      finally: () => { },
    }).call();

  }, []);
  const hasProcessedNewUser = useRef(false);
  
  useEffect(() => {
    const new_user = searchParams.get('new_user');
    if (new_user === '1' && !hasProcessedNewUser.current) {
      hasProcessedNewUser.current = true;
      setOpenNewUserAlert(true);
      // Remove the parameter from URL without triggering re-render
      const url = new URL(window.location.href);
      url.searchParams.delete('new_user');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [searchParams]);
  return (
    <>
      <NewUserWellcomePopup open={openNewUserAlert} onClose={() => setOpenNewUserAlert(false)} />

      <div className={`px-[15px] ${step === 1 ? "sm:px-0" : "sm:px-[40px] py-30"} pb-[90px] sm:pb-[50px] md:pb-0`}>
        {step === 0 && (
          <StartRenderVideo
            onAnalysis={(url) => {
              setStep(1);
              setProducUrl(url);
            }}
            setAdsEnabled={(value) => setAdsEnabled(value)}
            setNarration={(value) => setNarration(value)}
            setAudios={(value) => setAudios(value)}
            adsEnabled={adsEnabled}
            narration={narration}
          />
        )}
        {step === 1 && (
          <AnalysProduct
            adsEnabled={adsEnabled}
            narration={narration}
            onAnalysisFinish={setStep}
            producUrl={producUrl}
            audios={audios}
          />
        )}
      </div>
    </>
  );
};

export default Page;
