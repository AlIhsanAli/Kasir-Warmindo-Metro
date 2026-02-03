import { NextResponse } from 'next/server';
import { getMenuItems } from '@/lib/data';

export async function GET() {
  try {
    const menuItems = getMenuItems();
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
