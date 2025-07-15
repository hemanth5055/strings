import { getPostById } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import SignIn from "@/components/SignIn";
import SpecificPost from "@/components/SpecificPost";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = await params;
  const { success, userId: dbUserId } = await getDbUserId();
  if (!success || !dbUserId) return <SignIn />;
  const { success: PostSuccess, data } = await getPostById(postId);
  if (!data) return notFound();
  return (
    <div className="pt-5 w-full">
      <SpecificPost post={data} dbUserId={dbUserId} />
    </div>
  );
};

export default Page;
