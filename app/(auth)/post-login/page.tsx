import { redirect } from "next/navigation";

import { getPostLoginRedirectPath } from "@/lib/post-login-redirect";

const PostLoginPage = async () => {
  const redirectPath = await getPostLoginRedirectPath();

  redirect(redirectPath);
};

export default PostLoginPage;