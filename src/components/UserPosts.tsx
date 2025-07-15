import { getAllPostsOfuser } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import React from "react";
import Post from "./Post";

interface UserPostsProps {
  reqUserId: string;
}

export const UserPosts = async ({ reqUserId }: UserPostsProps) => {
  const dbUserRes = await getDbUserId();
  if (!dbUserRes.success || !dbUserRes.userId) return null;
  const postsRes = await getAllPostsOfuser(reqUserId);
  if (!postsRes.success || !Array.isArray(postsRes.data)) return null;
  if (postsRes.data.length === 0) {
    return (
      <h2 className="text-center text-gray-400 mt-6 text-base font-medium">
        No posts yet.
      </h2>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {postsRes.data.map((post) => (
        <Post key={post.id} post={post} dbUserId={dbUserRes.userId} />
      ))}
    </div>
  );
};
