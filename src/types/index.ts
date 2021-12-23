export interface ResponseBody<T> {
  data: T[];
  currentSize: number;
  totalSize: number;
  isSucceed: boolean;
  infoLayoutMessage?: string;
  error?: Error & { code: string };
  redirectUrl?: string;
}
