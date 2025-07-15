import { getPostById } from "@/actions/post.action";
import { getDbUserId, getUserByClerkId } from "@/actions/user.action";
import SignIn from "@/components/SignIn";
import SpecificPost from "@/components/SpecificPost";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = await params;
  const dbUserId = await getDbUserId();
  if (!dbUserId) return <SignIn></SignIn>;
  const post = await getPostById(postId);
  if (!post) {
    return notFound();
  }
  return (
    <div className="pt-5 w-full">
      <SpecificPost post={post} dbUserId={dbUserId}></SpecificPost>
    </div>
  );
};

export default page;
