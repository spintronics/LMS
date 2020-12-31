export enum ApiUrl {
  select_question = "/services/spaced-repitition/select_question",
  get_topics = "/api/lms/get_topics",
}

//fetch based api with types as per spec
export const request = function <T>(
  url: string,
  data?: any
): Promise<[string | null, { data: T } | null]> {
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
      return Promise.reject([response.statusText, null]);
    } else {
      return response.json().then((j) => [null, j]);
    }
  });
};

export const getTopics = () => request<[string[]]>(ApiUrl.get_topics);

export const selectQuestion = (tree: object, history: string[] = []) =>
  request<string[]>(ApiUrl.select_question, { tree, history });
