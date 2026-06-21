import { resend } from "@/lib/email";

export const sendProjectInviteEmail = async ({
  email,
  projectName,
  inviteUrl,
}: {
  email: string;
  projectName: string;
  inviteUrl: string;
}) => {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "PageLoop <onboarding@resend.dev>",
    to: email,
    subject: `You have been invited to review ${projectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>You have been invited to PageLoop</h1>

        <p>
          You have been invited to collaborate on
          <strong>${projectName}</strong>.
        </p>

        <p>
          Click the link below to accept the invitation:
        </p>

        <p>
          <a href="${inviteUrl}">
            Accept invitation
          </a>
        </p>

        <p style="color: #666; font-size: 12px;">
          This invitation expires in 7 days.
        </p>
      </div>
    `,
  });
};