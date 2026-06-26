import { Helmet } from 'react-helmet-async';
import { SEO_DEFAULT, SITE_URL } from '../../data/constants';

export default function Seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
}) {
  const pageTitle = title ? `${title} | PokéVerse` : SEO_DEFAULT.title;
  const pageDesc = description || SEO_DEFAULT.description;
  const pageImage = image || SEO_DEFAULT.image;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={pageImage.startsWith('http') ? pageImage : `${SITE_URL}${pageImage}`} />
      <meta property="og:site_name" content="PokéVerse" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={pageImage.startsWith('http') ? pageImage : `${SITE_URL}${pageImage}`} />
    </Helmet>
  );
}
