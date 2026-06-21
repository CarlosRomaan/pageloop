import { resend } from "@/lib/email";

export const sendCommentStatusEmail = async ({
  email,
  projectName,
  commentNumber,
  status,
  commentUrl,
}: {
  email: string;
  projectName: string;
  commentNumber: number;
  status: string;
  commentUrl: string;
}) => {
  const statusLabel =
    status === "IN_REVIEW"
      ? "ready for review"
      : status === "RESOLVED"
      ? "resolved"
      : status.toLowerCase();

  await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ??
      "PageLoop <onboarding@resend.dev>",

    to: email,

    subject: `Comment #${commentNumber} is ${statusLabel}`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Comment update</h1>

        <p>
          Comment <strong>#${commentNumber}</strong>
          in <strong>${projectName}</strong>
          is now <strong>${statusLabel}</strong>.
        </p>

        <p>
          <a href="${commentUrl}">
            Open comment
          </a>
        </p>
      </div>
    `,
  });
};