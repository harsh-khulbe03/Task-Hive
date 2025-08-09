import { NextResponse } from 'next/server';
import db from '../../_lib/db';
import { generateToken } from '../../_lib/auth';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    );
  }

  const user = db.users.find(u => u.username === username);
  
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const token = generateToken(user.id);

  return NextResponse.json({ token });
}