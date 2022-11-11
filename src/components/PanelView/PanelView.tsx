import { Box, Card } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { memo, ReactNode } from 'react';

export type Props = {
  title: string;
  header: ReactNode;
  children: ReactNode;
  description?: string;
  keywords?: string;
};

export const PanelView = memo(({ title, description, keywords, header, children }: Props) => {
  return (
    <Box col className="self-center w-full max-w-[480px] mt-2">
      <Helmet content={description || title} keywords={keywords} title={title} />

      <Box col className="w-full mx-2">
        {header}
      </Box>

      <Card
        stretch
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:h-auto"
        size="lg"
      >
        {children}
      </Card>
    </Box>
  );
});
