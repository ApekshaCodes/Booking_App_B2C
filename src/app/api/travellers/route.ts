import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Traveller from '../../../models/traveller';
import { verifyToken } from '../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    const userId = decoded.userId;

    const travellers = await req.json();

    if (!Array.isArray(travellers) || travellers.length === 0) {
      return NextResponse.json({ error: 'At least one traveller is required' }, { status: 400 });
    }

    await connectToDatabase();

    const toInsert = travellers.map((t) => ({
      userId, //token userId
      name: t.name,
      age: t.age,
      gender: t.gender,
      passportNumber: t.passportNumber
    }));

    const inserted = await Traveller.insertMany(toInsert);

    return NextResponse.json({ message: 'Travellers added', travellers: inserted }, { status: 201 });
  } catch (error) {
    console.error('❌ Error adding travellers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    const userId = decoded.userId;

    await connectToDatabase();

    const travellers = await Traveller.find({ userId });

    return NextResponse.json({ travellers });
  } catch (error) {
    console.error('❌ Error fetching travellers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


