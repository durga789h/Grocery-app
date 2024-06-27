// api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { nanoid } from 'nanoid';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest, res: NextResponse) {
  try {
    const { amount, name, email } = await request.json() as {
      amount: string,
      name: string,
      email: string,
    };

    const options = {
      amount: parseInt(amount) * 100,
      currency: 'INR',
      receipt: nanoid(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
