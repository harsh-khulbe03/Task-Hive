export type User = {
  id: string;
  username: string;
  password: string;
};

export type Board = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  dueDate?: Date;
  createdAt: Date;
  boardId: string;
  userId: string;
};
