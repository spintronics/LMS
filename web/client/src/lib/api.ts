//fetch based api with types as per spec
export const request = function <T>(
  url: string,
  data?: any
): Promise<[string | null, (LMS.api.Response & { data: T }) | null]> {
  let config: RequestInit = {
    method: data ? 'POST' : 'GET',
  };
  if (data) {
    config.headers = {
      'Content-type': 'application/json',
    };
    config.body = JSON.stringify(data);
  }
  return fetch(url, config).then((response) => {
    if (!response.ok) {
      return Promise.reject([response.statusText, null]);
    } else {
      return response.json().then((j) => [null, j]);
    }
  });
};

export const getQuestions = () => request<[string[]]>(apiUrl.questions);

export const selectQuestion = (tree: object, history: string[] = []) =>
  request<string[]>(apiUrl.selectQuestion, { tree, history });

export enum apiUrl {
  questions = '/api/lms/topics',
  selectQuestion = '/api/lms/select_question',
}
