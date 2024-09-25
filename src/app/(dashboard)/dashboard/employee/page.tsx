import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { EmployeeList } from './_modules/employee-list';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Employee', link: '/dashboard/employee' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function EmployeePage({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search?.toString() || null;

  return (
    <PageContainer>
      <Breadcrumbs items={breadcrumbItems} />
      <EmployeeList page={page} pageLimit={pageLimit} country={country} />
    </PageContainer>
  );
}
