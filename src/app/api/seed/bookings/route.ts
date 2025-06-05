import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import Order from '../../../../models/order';
import User from '../../../../models/user';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const users = await User.find(); // get all users
    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 400 });
    }

    const user = users[0]; // seed for first user

    const fakeBookings = [
      {
        userId: user._id,
        destination: 'Dubai',
        last_travel_date: new Date('2025-06-15'),
        details: 'Flight + Hotel',
      },
      {
        userId: user._id,
        destination: 'Paris',
        last_travel_date: new Date('2024-12-01'),
        details: 'Hotel only',
      },
      {
        userId: user._id,
        destination: 'Goa',
        last_travel_date: new Date('2025-07-10'),
        details: 'Flight + Resort',
      }
    ];

    const inserted = await Order.insertMany(fakeBookings);

    return NextResponse.json({ message: 'Bookings seeded', inserted });
  } catch (error) {
    console.error('❌ Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed bookings' }, { status: 500 });
  }
}