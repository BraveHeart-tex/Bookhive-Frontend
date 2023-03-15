class MessageModel {
  title: string;
  question: string;
  id?: number;
  userEmail?: string;
  adminEmail?: string;
  response?: string;
  closed?: boolean;

  constructor(
    title: string,
    question: string,
    userEmail: string,
    adminEmail: string,
    response: string,
    closed: boolean,
    id?: number
  ) {
    this.title = title;
    this.question = question;
    this.userEmail = userEmail;
    this.adminEmail = adminEmail;
    this.response = response;
    this.closed = closed;
    this.id = id;
  }
}

export default MessageModel;