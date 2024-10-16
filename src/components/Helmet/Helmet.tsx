import { Helmet as ReactHelmet } from "react-helmet-async";

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
    <title>CONICSwap - {title}</title>
    <meta content={content} name="description" />
    {keywords && <meta content={keywords} name="keywords" />}
  </ReactHelmet>
);
