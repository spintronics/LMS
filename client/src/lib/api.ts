//fetch based api with types as per spec
export const api = function <R, T>(
  url: string,
  data?: R
): Promise<LMS.api.Response & { data: T }> {
  let config: RequestInit = {
    method: data ? "POST" : "GET",
  };
  if (data) {
    config.headers = {
      "Content-type": "application/json",
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

export enum apiUrl {
  question = "/api/LMS/question",
}
