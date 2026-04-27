// import { prisma } from "@/lib/prisma";

// export async function checkSubscription(schoolId: string) {
//   const subscription = await prisma.subscription.findUnique({
//     where: { schoolId },
//     select: { status: true, currentPeriodEnd: true }
//   });

//   const now = new Date();

//   // Logic: Block if no subscription, status is not ACTIVE, or current time is past expiry
//   if (
//     !subscription || 
//     subscription.status !== "ACTIVE" || 
//     now > subscription.currentPeriodEnd
//   ) {
//     return { isExpired: true };
//   }

//   return { isExpired: false };
// }



import { prisma } from "@/lib/prisma";

export type SubscriptionTier = "INSTITUTIONAL" | "INDIVIDUAL" | "UNPAID";

export interface SubscriptionStatus {
  isActive: boolean;
  isExpired: boolean;
  tier: SubscriptionTier;
  planName: string | null;
  expiresAt: Date | null;
}

/**
 * UNIFIED SUBSCRIPTION CHECK
 * Rule 5: Checks school-wide subscription for institutional users.
 * Rule 6: Checks personal subscription for independent learners.
 * Rule 11: Derives status strictly from DB truth.
 */
export async function checkSubscription(
  userId: string,
  schoolId: string | null | undefined
): Promise<SubscriptionStatus> {
  const now = new Date();

  // 1. Fetch Subscription based on Tier (Rule 1 & 2)
  const subscription = await prisma.subscription.findFirst({
    where: schoolId 
      ? { schoolId: schoolId } // Tier 2: Institutional context
      : { profileId: userId },  // Tier 3: Individual context
    select: {
      status: true,
      currentPeriodEnd: true,
      plan: true,
    }
  });

  // 2. Resolve Tier Label
  const currentTier: SubscriptionTier = schoolId ? "INSTITUTIONAL" : "INDIVIDUAL";

  // 3. Handle "No Subscription" Case
  if (!subscription) {
    return {
      isActive: false,
      isExpired: false, // Never had one
      tier: "UNPAID",
      planName: null,
      expiresAt: null
    };
  }

  // 4. Calculate Truth (Rule 11)
  const statusLower = subscription.status.toLowerCase();
  const isExpired = subscription.currentPeriodEnd < now;
  const isActive = statusLower === "active" && !isExpired;

  return {
    isActive,
    isExpired,
    tier: isActive ? currentTier : "UNPAID",
    planName: subscription.plan,
    expiresAt: subscription.currentPeriodEnd
  };
}