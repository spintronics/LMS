//fetch based api with types as per spec
export const request = function <R, T>(
  url: string,
  data?: R
): Promise<LMS.api.Response & { data: T }> {
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
      throw new Error(response.statusText);
    } else {
      return response.json();
    }
  });
};

export const getQuestions = () => request<null, string[]>(apiUrl.questions);

export enum apiUrl {
  questions = '/api/lms/questions',
}
