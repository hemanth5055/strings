import React from "react";
import Post from "./Post";
import { getAllPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";

const Posts = async () => {
  const { success: postSuccess, data: posts } = await getAllPosts();
  const { success: userSuccess, userId: dbUserId } = await getDbUserId();
  if (!postSuccess || !userSuccess || !posts || !dbUserId) return null;
  console.log(posts);

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post: any) => (
        <Post key={post.id} post={post} dbUserId={dbUserId} />
      ))}
    </div>
  );
};

export default Posts;
