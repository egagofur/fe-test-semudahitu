export type Resp<T> = T;

export type TApiResponseData<T> = {
  data: T;
  meta: TPaginationProps;
};

export type TPaginationProps = {
  page: number;
  perPage: number;
  total: number;
  totalPage: number;
};

export type TApiResponseDropdown = {
  label: string;
  value: string;
}[];

export type TApiResponseError = {
  message: string | { [key: string]: any };
  statusCode: number;
};

export type TQueryParams = {
  page?: number;
  perPage?: number;
  search?: string;
  order?: string;
  sort?: string;
};

export type TApiResponse<T> = {
  data: T;
  message: string;
};
