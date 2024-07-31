export interface User {
  id: number;
  name: string;
  nickname: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdAt: Date;
  createdBy: string;
}

enum Role {
  USER,
  ADMIN,
}
