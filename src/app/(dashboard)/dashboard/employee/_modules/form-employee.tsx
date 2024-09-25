'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangleIcon, Trash, Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { baseEmployeeSchema, TEmployeeSchemaValues } from '../_schema/form-schema';
import { CalendarDatePicker } from '@/components/calender';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fetcher } from '@/lib/fetcher';
import { toast } from '@/hooks/use-toast';

interface EmployeeFormType {
  initialData: any | null;
}

export const CreateEmployee: React.FC<EmployeeFormType> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);

  const title = initialData ? 'Edit Employee' : 'Create Your Employee';
  const description = initialData ? 'Edit an Employee' : 'To create your Employee, please fill out the following form.';
  const toastMessage = initialData ? 'Employee updated.' : 'Employee created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues: TEmployeeSchemaValues = {
    firstName: '',
    lastName: '',
    email: '',
    approvalLine: '',
    birthdate: new Date(),
    branch: '',
    class: '',
    department: '',
    employeeId: '',
    employmentStatus: '',
    gender: 'Female',
    grade: '',
    groupStructure: '',
    jobLevel: '',
    jobPosition: '',
    joinDate: new Date(),
    maritalStatus: '',
    mobilePhone: '',
    nik: '',
    sbu: '',
    schedule: '',
    barcode: '',
    bloodType: '',
    religion: '',
    citizenIdAddress: '',
    manager: '',
    passportExpiry: new Date(),
    passportNumber: '',
    phone: '',
    postalCode: '',
    placeOfBirth: '',
    residentialAddress: '',
  };

  const form = useForm<TEmployeeSchemaValues>({
    resolver: zodResolver(baseEmployeeSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
    formState: { errors }
  } = form;

  console.log(form.getValues());

    useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        birthdate: new Date(initialData.birthdate),
        joinDate: new Date(initialData.joinDate),
        passportExpiry: initialData.passportExpiry ? new Date(initialData.passportExpiry) : undefined,
        mobilePhone: initialData.mobilePhone || '',
phone: initialData.phone || '',
      };
      form.reset(formattedData);
    }
  }, [initialData, form]);


const onSubmit = async (data: TEmployeeSchemaValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetcher.put(`/employees/${initialData.id}`, data);
      } else {
        await fetcher.post(`/employees`, data);
      }
      router.push(`/dashboard/employee`);
      toast({
        title: 'Success',
        description: toastMessage,
        variant: 'default'
      });
      form.reset();
    } catch (error: any) {
      console.log(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };


  const steps = [
    {
      id: 'Step 1',
      name: 'Personal Data',
      fields: ['firstName', 'lastName', 'email', 'mobilePhone', 'phone', 'placeOfBirth', 'birthdate', 'gender', 'maritalStatus', 'bloodType', 'religion']
    },
    {
      id: 'Step 2',
      name: 'Identity & Address',
      fields: ['nik', 'passportNumber', 'passportExpiry', 'postalCode', 'citizenIdAddress', 'residentialAddress']
    },
    {
      id: 'Step 3',
      name: 'Employment Data',
      fields: ['employeeId', 'barcode', 'groupStructure', 'employmentStatus', 'joinDate', 'branch', 'department', 'jobPosition', 'jobLevel', 'schedule', 'manager', 'sbu', 'grade', 'class', 'approvalLine']
    }
  ];

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as Array<keyof TEmployeeSchemaValues>, { shouldFocus: true });
    if (!output) return;
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <>
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {/* Implement delete functionality */}}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 flex flex-col"
        >
          <div
            className={cn(
              currentStep === 1
                ? 'w-full md:inline-block'
                : 'gap-8 md:grid md:grid-cols-3'
            )}
          >
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Ega"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Gofur"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type='email'
                          placeholder="egagofur@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobilePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Field text goes here"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                     <FormControl>
                           <Input
                          type="number"
                          placeholder="Field text goes here"
                          disabled={loading}
                          {...field}
                        />
                     </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Field text goes here"
                          disabled={loading}
                          {...field}
                        />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
        <FormItem>
            <FormLabel>Birthdate</FormLabel>
        <FormControl>
        <CalendarDatePicker
            date={field.value}
          onDateSelect={(value) => form.setValue("birthdate", value)}
          variant="outline"
          className="min-w-[250px] w-full"
          disabledDates={{
            before: new Date(1900, 0, 1),
            after: new Date(),
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
     <FormField
  control={form.control}
  name="gender"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Gender</FormLabel>
      <FormControl>
        <RadioGroup
          value={field.value}
          onValueChange={(value) => field.onChange(value)}
          defaultValue="Male"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="Male" />
            <Label htmlFor="Male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="Female" />
            <Label htmlFor="Female">Female</Label>
          </div>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maeital Status</FormLabel>
                              <FormControl>
                      <Select
                        disabled={loading}
                         onValueChange={field.onChange}
      value={field.value}
      defaultValue={field.value}
                      >

                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a status"
                            />
                          </SelectTrigger>

                        <SelectContent className='flex'>
                            <SelectItem value='yes'>
                                Yes
                            </SelectItem>
                            <SelectItem value='no'>
                                No
                            </SelectItem>
                        </SelectContent>
                      </Select>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a blood type"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value='A'>
                                A
                            </SelectItem>
                            <SelectItem value='B'>
                                B
                            </SelectItem>
                            <SelectItem value='AB'>
                                AB
                            </SelectItem>
                            <SelectItem value='O'>
                                O
                            </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a city"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value='islam'>
                                Islam
                            </SelectItem>
                            <SelectItem value='hindu'>
                                Hindu
                            </SelectItem>
                            <SelectItem value='christian'>
                                Christian
                            </SelectItem>
                            <SelectItem value='buddha'>
                                Buddha
                            </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 1 && (
                <>
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK (NPWP)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="3507010***"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passportNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Field text goes here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                     <FormField
  control={form.control}
  name="passportExpiry"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Passport Expiry</FormLabel>
      <FormControl>
        <CalendarDatePicker
          date={field.value}
          onDateSelect={(value) => form.setValue("passportExpiry", value)}
          variant="outline"
          className="min-w-[250px] w-full"
          disabledDates={{
            before: new Date(1900, 0, 1),
            after: new Date(),
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                            disabled={loading}
                            placeholder="Field text goes here"
                            {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="citizenIdAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizen ID Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Field text goes here"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="residentialAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                     <FormControl>
                            <Textarea
                              placeholder="Field text goes here"
                              disabled={loading}
                              {...field}
                            />
                     </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
             {currentStep === 2 && (
                <>
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="3507010***"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Field text goes here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Structure</FormLabel>
                      <FormControl>
                        <Input
                            disabled={loading}
                            placeholder="Field text goes here"
                            {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Status</FormLabel>
                       <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        >
                        <FormControl>
                        <>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a status"
                            />
                          </SelectTrigger>
                          <SelectContent className='flex'>
                                <SelectItem value='permanet'>
                                    Permanent
                                </SelectItem>
                                <SelectItem value='contract'>
                                    Contract
                                </SelectItem>
                            </SelectContent>
                        </>
                      </FormControl>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
  control={form.control}
  name="joinDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Join Date</FormLabel>
      <FormControl>
        <CalendarDatePicker
          date={field.value}
          onDateSelect={(value) => form.setValue("joinDate", value)}
          variant="outline"
          className="min-w-[250px] w-full"
          disabledDates={{
            before: new Date(1900, 0, 1),
            after: new Date(),
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                     <FormControl>
                           <Input
                              disabled={loading}
                              placeholder="Field text goes here"
                              {...field}
                            />
                     </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                    <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        >
                        <FormControl>
                        <>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a status"
                            />
                          </SelectTrigger>
                          <SelectContent className='flex'>
                                <SelectItem value='mind id'>
                                    MIND ID
                                </SelectItem>
                                <SelectItem value='nortis'>
                                    Nortis
                                </SelectItem>
                            </SelectContent>
                        </>
                        </FormControl>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="jobPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Position</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading}
                                placeholder="Field text goes here"
                                {...field}
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Level</FormLabel>
                    <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        >
                        <FormControl>
                        <>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a status"
                            />
                          </SelectTrigger>
                          <SelectContent className='flex'>
                                <SelectItem value='band1'>
                                BAND 1
                                </SelectItem>
                                <SelectItem value='band2'>
                                    BAND 2
                                </SelectItem>
                            </SelectContent>
                        </>
                        </FormControl>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule</FormLabel>
                    <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        >
                        <FormControl>
                        <>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a status"
                            />
                          </SelectTrigger>
                          <SelectContent className='flex'>
                                <SelectItem value='yes'>
                                Iya
                                </SelectItem>
                                <SelectItem value='no'>
                                    Tidak
                                </SelectItem>
                            </SelectContent>
                        </>
                        </FormControl>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading}
                                placeholder="Field text goes here"
                                {...field}
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sbu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SBU</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading}
                                placeholder="Field text goes here"
                                {...field}
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading}
                                placeholder="Field text goes here"
                                {...field}
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading}
                                placeholder="Field text goes here"
                                {...field}
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approvalLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approval Line</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading}
                                placeholder="Field text goes here"
                                {...field}
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

           {currentStep === steps.length - 1 && (
            <Button disabled={loading} type="submit">
              {action}
            </Button>
          )}
        </form>
      </Form>
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
