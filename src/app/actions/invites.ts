

// dont delete. this invite.ts is set up with resend


// 'use server';

// import { resend } from '@/lib/resend';
// import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient';
// import { prisma } from '@/lib/prisma';
// import { Role } from '@/generated/prisma/client';

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface InviteUserParams {
//     email: string;
//     role: 'TEACHER' | 'STUDENT' | 'PARENT';
//     schoolId: string;
//     schoolName: string;
//     invitedByName: string;
//     name?: string; // optional — pre-fills their profile name
// }

// interface InviteResult {
//     success: boolean;
//     error?: string;
// }

// // ── Main action ───────────────────────────────────────────────────────────────

// export async function inviteUser(params: InviteUserParams): Promise<InviteResult> {
//     const { email, role, schoolId, schoolName, invitedByName, name } = params;

//     try {
//         // ── Step 1: Validate email format ──────────────────────────────────
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return { success: false, error: 'Invalid email address.' };
//         }

//         // ── Step 2: Check if user already exists in this school ────────────
//         const existing = await prisma.profile.findUnique({
//             where: { email },
//             select: { id: true, schoolId: true, role: true },
//         });

//         if (existing) {
//             if (existing.schoolId === schoolId) {
//                 return { success: false, error: 'This user is already a member of your school.' };
//             }
//             // User exists in another school — still block to avoid cross-tenant confusion
//             return { success: false, error: 'This email is already registered on the platform.' };
//         }

//         // ── Step 3: Fetch school data for email branding ───────────────────
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: {
//                 id: true,
//                 name: true,
//                 primaryColor: true,
//                 secondaryColor: true,
//                 curriculumId: true,
//             },
//         });

//         if (!school) {
//             return { success: false, error: 'School not found.' };
//         }

//         // ── Step 4: Create Supabase auth user via admin invite ─────────────
//         // This generates a secure one-time invite link and creates the auth user.
//         // We pass role + schoolId as user metadata so the DB trigger or
//         // auth confirm route can pre-populate the profile.
//         const { data: inviteData, error: inviteError } =
//             await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
//                 data: {
//                     name: name ?? '',
//                     role,
//                     schoolId,
//                 },
//                 redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//             });

//         if (inviteError || !inviteData?.user) {
//             console.error('Supabase invite error:', inviteError?.message);

//             // Handle specific Supabase errors with friendly messages
//             if (inviteError?.message?.includes('already been registered')) {
//                 return { success: false, error: 'This email is already registered.' };
//             }
//             return {
//                 success: false,
//                 error: inviteError?.message ?? 'Failed to create invite.',
//             };
//         }

//         const userId = inviteData.user.id;

//         // ── Step 5: Pre-create the profile in Prisma ───────────────────────
//         // This ensures the profile exists with the correct role + schoolId
//         // the moment the user lands on the dashboard after confirming.
//         // We upsert in case a partial profile already exists.
//         await prisma.profile.upsert({
//             where: { email },
//             update: {
//                 role: role as Role,
//                 schoolId,
//                 name: name ?? null,
//             },
//             create: {
//                 id: userId,
//                 email,
//                 name: name ?? null,
//                 role: role as Role,
//                 schoolId,
//                 curriculumId: school.curriculumId,
//             },
//         });

//         // ── Step 6: Send branded invite email via Resend ───────────────────
//         const dashboardPath =
//             role === 'TEACHER' ? '/dashboard' :
//             role === 'STUDENT' ? '/student' :
//             '/parent';

//         const roleLabel =
//             role === 'TEACHER' ? 'teacher' :
//             role === 'STUDENT' ? 'student' :
//             'parent';

//         const { error: emailError } = await resend.emails.send({
//             from: `${schoolName} via EduAI <invites@${process.env.RESEND_DOMAIN ?? 'resend.dev'}>`,
//             to: email,
//             subject: `You've been invited to join ${schoolName} on EduAI`,
//             html: buildInviteEmail({
//                 recipientName: name,
//                 recipientEmail: email,
//                 schoolName,
//                 invitedByName,
//                 roleLabel,
//                 primaryColor: school.primaryColor,
//                 secondaryColor: school.secondaryColor,
//                 // Supabase sends the actual invite link to the user's email.
//                 // We direct them to set up their account via the confirm route.
//                 confirmUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
//                 dashboardPath,
//             }),
//         });

//         if (emailError) {
//             // Auth user + profile were created — don't fail the whole invite.
//             // Log it and return partial success so admin knows to follow up.
//             console.error('Resend email error:', emailError);
//             return {
//                 success: false,
//                 error: 'Account created but email failed to send. Ask the user to use "Forgot Password" to access their account.',
//             };
//         }

//         return { success: true };

//     } catch (err: any) {
//         console.error('inviteUser unexpected error:', err);
//         return { success: false, error: 'An unexpected error occurred. Please try again.' };
//     }
// }

// // ── Bulk invite ───────────────────────────────────────────────────────────────
// // Convenience wrapper for sending multiple invites at once.
// // Returns per-email results so the UI can show individual statuses.

// export async function inviteUsers(
//     invites: InviteUserParams[]
// ): Promise<{ email: string; result: InviteResult }[]> {
//     const results: { email: string; result: InviteResult }[] = [];

//     for (const invite of invites) {
//         const result = await inviteUser(invite);
//         results.push({ email: invite.email, result });

//         // Small delay between invites to avoid Supabase rate limits
//         await new Promise((resolve) => setTimeout(resolve, 300));
//     }

//     return results;
// }

// // ── Email template ────────────────────────────────────────────────────────────

// function buildInviteEmail({
//     recipientName,
//     recipientEmail,
//     schoolName,
//     invitedByName,
//     roleLabel,
//     primaryColor,
//     secondaryColor,
//     confirmUrl,
// }: {
//     recipientName?: string;
//     recipientEmail: string;
//     schoolName: string;
//     invitedByName: string;
//     roleLabel: string;
//     primaryColor: string;
//     secondaryColor: string;
//     confirmUrl: string;
//     dashboardPath: string;
// }) {
//     const greeting = recipientName ? `Hi ${recipientName.split(' ')[0]},` : 'Hi there,'

//     // Role-specific copy
//     const roleDescriptions: Record<string, string> = {
//         teacher: 'You\'ll be able to manage classes, create AI-powered lessons, and track student progress.',
//         student: 'You\'ll be able to access your lessons, take quizzes, and view your grades.',
//         parent: 'You\'ll be able to monitor your child\'s progress and receive school feedback.',
//     }

//     const roleDescription = roleDescriptions[roleLabel] ?? ''

//     return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>You've been invited to ${schoolName}</title>
//     </head>
//     <body style="margin:0;padding:0;background:#0f172a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
//         <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
//             <tr>
//                 <td align="center">
//                     <table width="520" cellpadding="0" cellspacing="0" style="background:${secondaryColor};border-radius:20px;overflow:hidden;max-width:520px;width:100%;">

//                         <!-- Header bar -->
//                         <tr>
//                             <td style="background:${primaryColor};padding:20px 32px;display:flex;align-items:center;justify-content:space-between;">
//                                 <table width="100%" cellpadding="0" cellspacing="0">
//                                     <tr>
//                                         <td>
//                                             <p style="margin:0;color:${secondaryColor};font-size:20px;font-weight:900;letter-spacing:-0.5px;">
//                                                 EduAI
//                                             </p>
//                                         </td>
//                                         <td align="right">
//                                             <span style="background:rgba(0,0,0,0.15);color:${secondaryColor};font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:capitalize;letter-spacing:0.5px;">
//                                                 ${roleLabel}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 </table>
//                             </td>
//                         </tr>

//                         <!-- Body -->
//                         <tr>
//                             <td style="padding:36px 32px 24px;">

//                                 <!-- Greeting -->
//                                 <h1 style="margin:0 0 6px;color:#f1f5f9;font-size:24px;font-weight:900;line-height:1.2;letter-spacing:-0.5px;">
//                                     You're invited! 🎉
//                                 </h1>
//                                 <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
//                                     ${greeting}
//                                 </p>

//                                 <!-- School + role context -->
//                                 <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:28px;">
//                                     <tr>
//                                         <td style="padding:16px 20px;">
//                                             <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
//                                                 Invited by
//                                             </p>
//                                             <p style="margin:0 0 14px;color:#f1f5f9;font-size:14px;font-weight:700;">
//                                                 ${invitedByName}
//                                             </p>
//                                             <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
//                                                 School
//                                             </p>
//                                             <p style="margin:0 0 14px;color:${primaryColor};font-size:15px;font-weight:900;">
//                                                 ${schoolName}
//                                             </p>
//                                             <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
//                                                 Your role
//                                             </p>
//                                             <p style="margin:0;color:#f1f5f9;font-size:14px;font-weight:700;text-transform:capitalize;">
//                                                 ${roleLabel}
//                                             </p>
//                                         </td>
//                                     </tr>
//                                 </table>

//                                 <!-- Role description -->
//                                 <p style="margin:0 0 28px;color:#94a3b8;font-size:13px;line-height:1.7;">
//                                     ${roleDescription}
//                                 </p>

//                                 <!-- CTA button -->
//                                 <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
//                                     <tr>
//                                         <td style="background:${primaryColor};border-radius:12px;">
//                                             <a href="${confirmUrl}"
//                                                style="display:inline-block;padding:16px 36px;color:${secondaryColor};font-size:15px;font-weight:900;text-decoration:none;letter-spacing:0.3px;">
//                                                 Accept Invitation →
//                                             </a>
//                                         </td>
//                                     </tr>
//                                 </table>

//                                 <!-- Expiry notice -->
//                                 <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:24px;">
//                                     <tr>
//                                         <td style="padding:12px 16px;">
//                                             <p style="margin:0;color:#475569;font-size:12px;line-height:1.6;">
//                                                 ⏱ This invitation link expires in <strong style="color:#64748b;">72 hours</strong>.
//                                                 After that, ask your admin to resend the invite.
//                                             </p>
//                                         </td>
//                                     </tr>
//                                 </table>

//                                 <!-- Fallback URL -->
//                                 <p style="margin:0;color:#334155;font-size:11px;line-height:1.7;word-break:break-all;">
//                                     Button not working? Copy this link into your browser:<br/>
//                                     <a href="${confirmUrl}" style="color:${primaryColor};">${confirmUrl}</a>
//                                 </p>
//                             </td>
//                         </tr>

//                         <!-- Footer -->
//                         <tr>
//                             <td style="padding:16px 32px 24px;border-top:1px solid rgba(255,255,255,0.06);">
//                                 <p style="margin:0;color:#1e293b;font-size:11px;line-height:1.6;color:#334155;">
//                                     This invite was sent to <strong>${recipientEmail}</strong>.
//                                     If you weren't expecting this, you can safely ignore it — no account will be created unless you click the button above.
//                                 </p>
//                                 <p style="margin:8px 0 0;color:#1e2939;font-size:11px;color:#1e293b;">
//                                     © ${new Date().getFullYear()} EduAI Platform
//                                 </p>
//                             </td>
//                         </tr>

//                     </table>
//                 </td>
//             </tr>
//         </table>
//     </body>
//     </html>
//     `
// }


'use server';

import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient';
import { prisma } from '@/lib/prisma';
import { Role } from '@/generated/prisma/client';

interface InviteUserParams {
    email: string;
    role: 'TEACHER' | 'STUDENT' | 'PARENT';
    schoolId: string;
    schoolName: string;
    invitedByName: string;
    name?: string;
}

interface InviteResult {
    success: boolean;
    error?: string;
}

export async function inviteUser(params: InviteUserParams): Promise<InviteResult> {
    const { email, role, schoolId, name } = params;

    try {
        // 1. Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Invalid email address.' };
        }

        // 2. Check duplicate
        const existing = await prisma.profile.findUnique({
            where: { email },
            select: { id: true, schoolId: true },
        });

        if (existing) {
            if (existing.schoolId === schoolId) {
                return { success: false, error: 'This user is already in your school.' };
            }
            return { success: false, error: 'This email is already registered.' };
        }

        // 3. Fetch school for curriculumId
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: { curriculumId: true },
        });

        if (!school) {
            return { success: false, error: 'School not found.' };
        }

        // 4. Supabase invite — sends email automatically to any address
        const { data: inviteData, error: inviteError } =
            await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                data: {
                    name: name ?? '',
                    role,
                    schoolId,
                },
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
            });

        if (inviteError || !inviteData?.user) {
            if (inviteError?.message?.includes('already been registered')) {
                return { success: false, error: 'This email is already registered.' };
            }
            return { success: false, error: inviteError?.message ?? 'Failed to send invite.' };
        }

        // 5. Pre-create profile in Prisma
        await prisma.profile.upsert({
            where: { email },
            update: { role: role as Role, schoolId, name: name ?? null },
            create: {
                id: inviteData.user.id,
                email,
                name: name ?? null,
                role: role as Role,
                schoolId,
                curriculumId: school.curriculumId,
            },
        });

        return { success: true };

    } catch (err: any) {
        console.error('inviteUser error:', err);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

// Bulk wrapper
export async function inviteUsers(
    invites: InviteUserParams[]
): Promise<{ email: string; result: InviteResult }[]> {
    const results: { email: string; result: InviteResult }[] = [];
    for (const invite of invites) {
        const result = await inviteUser(invite);
        results.push({ email: invite.email, result });
        await new Promise((r) => setTimeout(r, 300)); // avoid rate limits
    }
    return results;
}