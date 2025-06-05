import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/db';
import Order from '../../../../../models/order';
import { verifyToken } from '../../../../../lib/auth';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    const userId = decoded.userId;

    await connectToDatabase();

    const { id } = await Promise.resolve(context.params);

    console.log('Generating booking summary for ID:', id);

    const booking = await Order.findOne({ _id: id, userId });

    console.log('Booking found:', booking);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const prompt = `
      Generate a friendly booking summary for the following:
      Destination: ${booking.destination}
      Last Travel Date: ${booking.last_travel_date.toDateString()}
      Details: ${booking.details}

      Format it like:
      "You're traveling to <destination> on <date>. Your booking includes <details>."
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    console.log('OpenAI response status:', response.status);
    const result = await response.json();
    if (response.status === 429) {
  const fallback = `You're traveling to ${booking.destination} on ${booking.last_travel_date.toDateString()}. Your booking includes ${booking.details}.`;
  return NextResponse.json({ summary: fallback });
}
    const summary = result.choices?.[0]?.message?.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('❌ Booking summary generation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
