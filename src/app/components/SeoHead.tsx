import { SEO_DATA } from '@/utils/constant';
import Head from "next/head"

interface SeoHeadProps {
  title?: string;
  site_name?: string;
  description?: string;
  canonical?: string;
  url?: string;
  image?: string;
  author?: string;
  date?: string;
  templateTitle?: string;
}

const SeoHead: React.FC<SeoHeadProps> = (props) => {
  const meta = {
    ...SEO_DATA,
    ...props,
  };

  // Use siteName if there is templateTitle, else show full title
  meta.title = props.templateTitle ? `${props.templateTitle} | ${meta.site_name}` : meta.title;

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />

      <link rel="canonical" href={meta.canonical} />
      {/* Open Graph */}
      <meta property="og:site_name" content={meta.site_name} />
      <meta property="og:description" content={meta.ogDescription} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta name="image" property="og:image" content={meta.image} />
      <meta property="og:url" content={meta.canonical} />
      {/* Twitter */}
      <meta name="twitter:title" content={meta.ogTitle} />
      <meta name="twitter:description" content={meta.ogDescription} />
      <meta name="twitter:image" content={meta.image} />
    </>
  );
};

export default SeoHead;
