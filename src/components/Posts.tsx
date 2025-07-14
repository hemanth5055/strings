import React from "react";
import Post from "./Post";
import { getAllPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";

const Posts = async ({}) => {
  type PostType = Awaited<ReturnType<typeof getAllPosts>>[number];
  const posts = await getAllPosts();
  const dbUserId = await getDbUserId();
  if (!dbUserId) return;
  return (
    <div className="flex flex-col gap-2">
      {posts.map((post: PostType) => (
        <Post key={post.id} post={post} dbUserId={dbUserId} />
      ))}
    </div>
  );
};

export default Posts;
