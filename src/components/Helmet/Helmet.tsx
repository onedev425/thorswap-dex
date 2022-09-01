import { Helmet as ReactHelmet } from 'react-helmet';

export const Helmet = ({ title, content }: { title: string; content: string }) => (
  <ReactHelmet>
    <title>{title}</title>
    <meta content={content} name="description" />
  </ReactHelmet>
);
