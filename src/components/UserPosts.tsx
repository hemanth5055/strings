import { getAllPosts, getAllPostsOfuser } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import React from "react";
import Post from "./Post";

const UserPosts = async ({ reqUserId }: { reqUserId: string }) => {
  type PostType = Awaited<ReturnType<typeof getAllPosts>>[number];
  const ownerId = await getDbUserId();
  if (!ownerId) return;
  const posts = await getAllPostsOfuser(reqUserId);
  return (
    <div className="flex flex-col gap-2">
      {posts.map((post: PostType) => (
        <Post key={post.id} post={post} dbUserId={ownerId} />
      ))}
    </div>
  );
};

export default UserPosts;
