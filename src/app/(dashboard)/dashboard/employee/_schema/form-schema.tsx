import { z } from 'zod';

export const baseEmployeeSchema = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
 mobilePhone: z
  .string(),
phone: z
  .string()
  .optional(),
  placeOfBirth: z.string().optional(),
  birthdate: z.date().optional(),
  gender: z.enum(['Male', 'Female']),
  maritalStatus: z.string().optional(),
  bloodType: z.string().optional(),
  religion: z.string().optional(),
  nik: z.string().length(16, 'NIK must be 16 characters long'),
  passportNumber: z.string().optional(),
  passportExpiry: z.date().optional(),
  postalCode: z.string().optional(),
  citizenIdAddress: z.string().optional(),
  residentialAddress: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  barcode: z.string().optional(),
  groupStructure: z.string().min(1, 'Group structure is required'),
  employmentStatus: z.string().min(1, 'Employment status is required'),
  joinDate: z.date(),
  branch: z.string().min(1, 'Branch is required'),
  department: z.string().min(1, 'Department is required'),
  jobPosition: z.string().min(1, 'Job position is required'),
  jobLevel: z.string().min(1, 'Job level is required'),
  grade: z.string().min(1, 'Grade is required'),
  class: z.string().min(1, 'Class is required'),
  schedule: z.string().min(1, 'Schedule is required'),
  approvalLine: z.string().min(1, 'Approval line is required'),
  manager: z.string().optional(),
  sbu: z.string().min(1, 'SBU is required'),
});

export type TEmployeeSchemaValues = z.infer<typeof baseEmployeeSchema>;
