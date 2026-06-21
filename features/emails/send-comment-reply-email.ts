import { resend } from "@/lib/email";

export const sendCommentReplyEmail = async ({
  email,
  projectName,
  commentNumber,
  replyMessage,
  commentUrl,
}: {
  email: string;
  projectName: string;
  commentNumber: number;
  replyMessage: string;
  commentUrl: string;
}) => {
  await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ??
      "PageLoop <onboarding@resend.dev>",
    to: email,
    subject: `New reply on comment #${commentNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>New reply</h1>

        <p>
          There is a new reply on comment
          <strong>#${commentNumber}</strong>
          in <strong>${projectName}</strong>.
        </p>

        <div style="padding:12px;border:1px solid #ddd;border-radius:8px;">
          ${replyMessage}
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