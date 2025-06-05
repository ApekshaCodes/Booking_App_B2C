import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import Traveller from '../../../../models/traveller';
import { verifyToken } from '../../../../lib/auth';

export async function PUT(
  req: NextRequest,
  context: { params: { traveller_id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    const userId = decoded.userId;

    const { traveller_id } = context.params; // ✅ CORRECT SYNTAX

    const { name, age, gender, passportNumber } = await req.json();

    await connectToDatabase();

    const updated = await Traveller.findByIdAndUpdate(
      traveller_id,
      { name, age, gender, passportNumber },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Traveller not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Traveller updated', traveller: updated });
  } catch (error) {
    console.error('❌ Error updating traveller:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  context: { params: { traveller_id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    const userId = decoded.userId;
    const { traveller_id } = context.params;

    await connectToDatabase();

    const deleted = await Traveller.findOneAndDelete({
      _id: traveller_id,
      userId // ensures user owns this traveller
    });

    if (!deleted) {
      return NextResponse.json({ error: 'Traveller not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Traveller deleted' });
  } catch (error) {
    console.error('❌ Error deleting traveller:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


