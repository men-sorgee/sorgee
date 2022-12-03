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
}

const Page: FC<PageProps> = ({
  title,
  loading,
  description,
  header,
  sectionClass = 'gradient',
  children
}) => {
  useMeta(title, description);
  return (
    <>
      <h1>{title}</h1>
      <section className={`${sectionClass}`}>
        {header}
        {(loading && (
          <Loading>
            <h3>Loading</h3>
          </Loading>
        )) ||
          children}
      </section>
    </>
  );
};
export default Page;
