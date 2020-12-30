declare namespace LMS {
  interface Question {
    content: string;
    answers: string[];
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
