export interface TypeOfTopic {
  TypeID: number;
  NameOfType: string;
}
export interface Topic {
  TopicID: number;
  TitleTopic: string;
  Description: string;
  TypeID: number;
  UserID: number; // Người tạo topic
}

export interface Thread {
  ThreadID: number;
  TitleThread: string;
  ThreadDescription: string;
  Likes: number;
  Comments: number;
  DateCreated: string; // Định dạng 'YYYY-MM-DDTHH:mm:ssZ' (ISO 8601)
  TopicID: number;
  UserID: number; // Người tạo thread
}
