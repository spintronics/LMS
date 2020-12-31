declare namespace LMS {
  interface question {
    content: string;
    answers: string[];
  }
  namespace api {
    interface Response {
      status?: number;
    }
    enum url {
      select_question = "/api/lms/select_question",
      get_topics = "/api/lms/get_topics",
    }
  }
  namespace service {
    // matches docker-compose.yml
    enum ip {
      spaced_repition = "http://spaced-repitition:1000",
    }
  }
}

interface TopicNode {
  expanded?: boolean;
  unolded?: boolean;
  weight?: number;
  enabled?: boolean;
  isQuestion?: boolean;
  [key: string]: any;
}
