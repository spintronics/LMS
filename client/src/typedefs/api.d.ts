declare namespace LMS.api {
  interface QuestionRequest {
    questionSet: string;
  }
  interface QuestionAnswer {
    identifier: string;
  }
  interface Response {
    data: { [key: string]: any };
    timestamp?: string;
    responseType?: string;
  }
}
