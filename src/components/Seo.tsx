import React from "react";
import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
};

const Seo: React.FC<SeoProps> = ({ title, description, canonicalPath }) => {
  const url = typeof window !== "undefined"
    ? `${window.location.origin}${canonicalPath ?? window.location.pathname}`
    : canonicalPath ?? "/";

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

export default Seo;
