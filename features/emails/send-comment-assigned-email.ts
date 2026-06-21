import { resend } from "@/lib/email";

export const sendCommentAssignedEmail = async ({
  email,
  projectName,
  commentNumber,
  commentMessage,
  commentUrl,
}: {
  email: string;
  projectName: string;
  commentNumber: number;
  commentMessage: string;
  commentUrl: string;
}) => {
  await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ??
      "PageLoop <onboarding@resend.dev>",

    to: email,

    subject: `New comment assigned to you`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>New comment assigned</h1>

        <p>
          A new comment has been assigned to you in
          <strong>${projectName}</strong>.
        </p>

        <div style="padding:12px;border:1px solid #ddd;border-radius:8px;">
          <strong>#${commentNumber}</strong><br/>
          ${commentMessage}
        </div>

        <p style="margin-top:16px;">
          <a href="${commentUrl}">
            Open comment
          </a>
        </p>
      </div>
    `,
  });
};