import { Helmet as ReactHelmet } from 'react-helmet';

export const Helmet = ({
  title,
  content,
  keywords,
}: {
  keywords?: string;
  title: string;
  content: string;
}) => (
  <ReactHelmet>
    <title>THORSwap - {title}</title>
    <meta content={content} name="description" />
    {keywords && <meta content={keywords} name="keywords" />}
  </ReactHelmet>
);
