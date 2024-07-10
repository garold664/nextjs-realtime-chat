export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

interface Chat {
  id: string;
  messages: Message[];
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
