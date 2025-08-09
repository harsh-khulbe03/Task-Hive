import { NextResponse } from 'next/server';
import db from '../../_lib/db';
import { authenticateRequest } from '../../_lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('boardId');

  if (!boardId) {
    return NextResponse.json(
      { error: 'boardId query parameter is required' },
      { status: 400 }
    );
  }

  // Verify the board belongs to the user
  const board = db.boards.find(b => b.id === boardId && b.userId === user.id);
  if (!board) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  const tasks = db.tasks.filter(
    task => task.boardId === boardId && task.userId === user.id
  );

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, dueDate, boardId } = await request.json();

  if (!title || !boardId) {
    return NextResponse.json(
      { error: 'Title and boardId are required' },
      { status: 400 }
    );
  }

  // Verify the board belongs to the user
  const board = db.boards.find(b => b.id === boardId && b.userId === user.id);
  if (!board) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  const newTask = {
    id: uuidv4(),
    title,
    description,
    status: 'pending' as const,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    createdAt: new Date(),
    boardId,
    userId: user.id,
  };

  db.tasks.push(newTask);

  return NextResponse.json(newTask, { status: 201 });
}