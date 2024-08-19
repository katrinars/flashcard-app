import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.client_reference_id;
      const planName = session.metadata.plan;

      // Update the user's metadata with their new plan
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { plan: planName },
      });

      console.log(`Updated user ${userId} with plan ${planName}`);
    } catch (error) {
      console.error("Error updating user metadata:", error);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
