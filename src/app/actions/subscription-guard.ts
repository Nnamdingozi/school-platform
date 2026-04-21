import { prisma } from "@/lib/prisma";

export async function checkSubscription(schoolId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { schoolId },
    select: { status: true, currentPeriodEnd: true }
  });

  const now = new Date();

  // Logic: Block if no subscription, status is not ACTIVE, or current time is past expiry
  if (
    !subscription || 
    subscription.status !== "ACTIVE" || 
    now > subscription.currentPeriodEnd
  ) {
    return { isExpired: true };
  }

  return { isExpired: false };
}