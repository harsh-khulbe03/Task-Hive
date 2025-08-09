import { NextResponse } from 'next/server';
import db from '../../../_lib/db';
import { authenticateRequest } from '../../../_lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const board = db.boards.find(b => b.id === params.id && b.userId === user.id);
  if (!board) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  return NextResponse.json(board);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();
  const board = db.boards.find(b => b.id === params.id && b.userId === user.id);

  if (!board) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  if (!name) {
    return NextResponse.json(
      { error: 'Board name is required' },
      { status: 400 }
    );
  }

  board.name = name;
  return NextResponse.json(board);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const boardIndex = db.boards.findIndex(
    b => b.id === params.id && b.userId === user.id
  );

  if (boardIndex === -1) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  // Delete all tasks associated with this board
  db.tasks = db.tasks.filter(task => task.boardId !== params.id);
  
  // Delete the board
  db.boards.splice(boardIndex, 1);

  return NextResponse.json({ message: 'Board deleted successfully' });
}