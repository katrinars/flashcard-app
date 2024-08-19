import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100);
};

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  const body = await req.json();
  const { plan } = body;

  let amount;
  switch (plan) {
    case "Student":
      amount = 3;
      break;
    case "Pro":
      amount = 10;
      break;
    default:
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const params = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${plan} Subscription`,
          },
          unit_amount: formatAmountForStripe(amount, "usd"), // $10.00
          recurring: {
            interval: "month",
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/result?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    cancel_url: `http://localhost:3000/result?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    metadata: {
      tier: plan,
    },
  };

  const checkoutSession = await stripe.checkout.sessions.create(params);

  return NextResponse.json(checkoutSession, {
    status: 200,
  });
}
