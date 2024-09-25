'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Employee } from '@/constants/data';
import { EmployeeTable } from '@/components/table/employee-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { columns } from '@/components/table/columns';

type EmployeeListProps = {
  page: number;
  pageLimit: number;
  country: string | null;
};

export function EmployeeList({ page, pageLimit, country }: EmployeeListProps) {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchEmployees() {
      const offset = page
      const token = session?.accessToken;

      const res = await fetch(
        `http://localhost:3004/api/v1/employees?page=${offset}&perPage=${pageLimit}` +
        (country ? `&search=${country}` : ''),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const employeeRes = await res.json();
      console.log(employeeRes);

      setEmployee(employeeRes.data);
      setTotalUsers(employeeRes.total_users);
      setPageCount(Math.ceil(employeeRes.total_users / pageLimit));
    }

    if (session?.accessToken) {
      fetchEmployees();
    }
  }, [page, pageLimit, country, session]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Employees`} description="Manage employees" />
        <Link href="/dashboard/employee/add" className={cn(buttonVariants({ variant: 'default' }))}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
     <EmployeeTable
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={employee}
          pageCount={pageCount}
        />
    </>
  );
}
