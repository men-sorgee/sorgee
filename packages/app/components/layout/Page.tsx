import type { FC } from 'react';
import { useMeta } from '@/lib/hooks/use-meta-context';
import Loading from 'components/ui/Loading';

interface PageProps {
  title: string;
  loading?: boolean;
  header?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  description?: string;
  sectionClass?: string;
  titleClass?: string;
}

const Page: FC<PageProps> = ({
  title,
  loading,
  description,
  header,
  sectionClass = '',
  children,
  titleClass
}) => {
  useMeta(title, description);
  return (
    <>
      <h1 className={titleClass}>{title}</h1>
      <div className={`w-full ${sectionClass}`}>
        {header}
        {(loading && (
          <Loading>
            <h3>Loading</h3>
          </Loading>
        )) ||
          children}
      </div>
    </>
  );
};
export default Page;
