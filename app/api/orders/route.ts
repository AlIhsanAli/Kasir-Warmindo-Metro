import { NextRequest, NextResponse } from 'next/server';
import { getOrders, addOrder } from '@/lib/data';
import { Order } from '@/lib/types';

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, tableNumber, items } = body;

    if (!customerName || !tableNumber || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const total = items.reduce((sum: number, item: any) => sum + (item.menuItem.price * item.quantity), 0);

    const newOrder = addOrder({
      customerName,
      tableNumber,
      items,
      total,
      status: 'menunggu'
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
