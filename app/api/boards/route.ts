import { NextResponse } from 'next/server';
import db from '../../_lib/db';
import { authenticateRequest } from '../../_lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const boards = db.boards.filter(board => board.userId === user.id);
  return NextResponse.json(boards);
}

export async function POST(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name) {
    return NextResponse.json(
      { error: 'Board name is required' },
      { status: 400 }
    );
  }

  const newBoard = {
    id: uuidv4(),
    name,
    userId: user.id,
    createdAt: new Date(),
  };

  db.boards.push(newBoard);

  return NextResponse.json(newBoard, { status: 201 });
}