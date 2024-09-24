'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useState } from 'react';
import { CreateEmployee } from '../_modules/form-employee';
import { fetcher } from '@/lib/fetcher';
import { TEmployeeSchemaValues } from '../_schema/form-schema';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Employee', link: '/dashboard/employee' },
  { title: 'Create', link: '/dashboard/employee/create' }
];

export default function Page() {
    const [dataUpdate, setDataUpdate] = useState<{
        message: string;
        data: TEmployeeSchemaValues;
    } | null>(null);

    const employeeId = 'cm1ainxok00022ie42cz8t1uq';

    const getEmployee = async (id: string) => {
    const response = await fetcher.get<{
        message: string;
        data: TEmployeeSchemaValues;
    }>(`/employees/${id}`);
    return response;
    }

    useEffect(() => {
    if (employeeId) {
        getEmployee(employeeId).then((data) => {
        setDataUpdate(data);
        });
    }
    }, [employeeId]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CreateEmployee
          initialData={dataUpdate?.data}
          key={'create-employee'}
        />
      </div>
    </ScrollArea>
  );
}
