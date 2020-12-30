declare namespace LMS.api {
  interface Response {
    data: { [key: string]: any };
    timestamp?: string;
    responseType?: string;
    success: boolean;
  }
}
