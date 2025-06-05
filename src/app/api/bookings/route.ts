import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Order from '../../../models/order';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    const userId = decoded.userId;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (!status || !['upcoming', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid or missing status' }, { status: 400 });
    }

    await connectToDatabase();

    const today = new Date();
    const condition =
      status === 'upcoming'
        ? { last_travel_date: { $gte: today } }
        : { last_travel_date: { $lt: today } };

    const bookings = await Order.find({ userId, ...condition });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('❌ GET /api/bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}