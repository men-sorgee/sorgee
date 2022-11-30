import type { FC } from 'react';
import { useMeta } from 'lib/hooks/user-meta-context';
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
  sectionClass = 'dark',
  children
}) => {
  useMeta(title, description);
  return (
    <>
      <section className={sectionClass}>
        <h1>{title}</h1>
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
