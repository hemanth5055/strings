export const dynamic = "force-dynamic";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("❌ Missing WEBHOOK_SECRET environment variable");
    return new Response("Server configuration error", { status: 500 });
  }
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  console.log(svix_id);
  console.log(svix_timestamp);
  console.log(svix_signature);
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const body = await req.text();

  // // --- CRITICAL DEBUGGING STEP ---
  // console.log("--- Verifying Webhook Signature ---");
  // console.log("svix-id:", svix_id);
  // console.log("svix-timestamp:", svix_timestamp);
  // console.log("svix-signature:", svix_signature);
  // console.log("Request Body:", body); // <-- ADD THIS LINE
  // console.log("---------------------------------");
  // // -------------------------------

  const svix = new Webhook(webhookSecret);
  let event: WebhookEvent;

  try {
    event = svix.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const eventType = event.type;
  if (eventType === "user.created") {
    const user = event.data;
    try {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          username:
            user.username ??
            user.email_addresses[0].email_address.split("@")[0],
          email: user.email_addresses[0].email_address,
          image: user.image_url,
        },
      });
      console.log("👤 New user created:", user.id);
    } catch (err) {
      console.error("Database error:", err);
      return new Response("Database error", { status: 500 });
    }
  }
  return new Response("Webhook processed successfully", { status: 200 });
}
