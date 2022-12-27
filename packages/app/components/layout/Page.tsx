import { setMeta } from '@/lib/hooks/use-meta-context';
import Loading from 'components/ui/Loading';

interface Props {
  title: string;
  loading?: boolean;
  header?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  description?: string;
  sectionClass?: string;
  titleClass?: string;
}

const Page = ({
  title,
  loading,
  description,
  header,
  sectionClass = '',
  children,
  titleClass
}: Props) => {
  setMeta(title, description);
  return (
    <article>
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
    </article>
  );
};

export default Page;
