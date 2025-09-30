'use client';

interface GoogleAnalyticsProps {
  gaMeasurementId: string;
}

export default function GoogleAnalytics({ gaMeasurementId }: GoogleAnalyticsProps) {
  if (!gaMeasurementId) return null;

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `,
        }}
      />
    </>
  );
}
