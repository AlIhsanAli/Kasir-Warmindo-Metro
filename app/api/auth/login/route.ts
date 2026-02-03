import { NextRequest, NextResponse } from 'next/server';

// Mock admin credentials (in real app, use database)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // In real app, generate JWT token
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: { id: '1', username }
      });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
