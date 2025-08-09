type User = {
  id: string;
  username: string;
  password: string;
};

type Board = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
};

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  dueDate?: Date;
  createdAt: Date;
  boardId: string;
  userId: string;
};

const db = {
  users: [] as User[],
  boards: [] as Board[],
  tasks: [] as Task[],
};

export default db;
