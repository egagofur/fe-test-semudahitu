export interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export type TBaseEntity = {
  created_at: Date;
  created_by: string | null;
  created_by_username: string;
  updated_at: Date | null;
  updated_by: string | null;
  updated_by_username: string;
  deleted_at: Date | null;
  deleted_by: string | null;
  deleted_by_username: string;
};
