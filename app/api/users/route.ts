import { NextResponse } from 'next/server';
import db from '../../_lib/db';
import { generateToken } from '../../_lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    );
  }

  if (db.users.some(u => u.username === username)) {
    return NextResponse.json(
      { error: 'Username already exists' },
      { status: 400 }
    );
  }

  const newUser = {
    id: uuidv4(),
    username,
    password, // In a real app, hash this password
  };

  db.users.push(newUser);

  const token = generateToken(newUser.id);

  return NextResponse.json({ token }, { status: 201 });
}