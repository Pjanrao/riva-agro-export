
import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, contactNo, password } = await req.json();

    if (!name || !email || !password || !contactNo) {
      return NextResponse.json({ message: 'Name, email, contactNo, and password are required' }, { status: 400 });
    }
    
    if (password.length < 8) {
        return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      name,
      email,
      contactNo,
      password: hashedPassword,
      role: 'User',
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
