"use client";
import React, { useState } from "react";
import { PiTrashSimple } from "react-icons/pi";

import { MdVerified, MdOutlineModeComment } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import Image from "next/image";
import { deletePost, getAllPosts, toggleLike } from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";
type PostType = Awaited<ReturnType<typeof getAllPosts>>[number];
const Post = ({ post, dbUserId }: { post: PostType; dbUserId: string }) => {
  const { user } = useUser();
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptmisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };
  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (!result) console.log("failed to delete post");
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 px-3 md:px-0 max-w-screen-sm mx-auto">
      <div className="w-full flex items-start gap-3 sm:gap-4">
        {/* Profile image */}
        <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] relative rounded-full bg-gray-800 shrink-0">
          <Image
            fill
            src={post.author.image}
            alt="profile"
            className="object-cover rounded-full"
          />
        </div>

        {/* Post content */}
        <div className="flex flex-col gap-1 w-full">
          {/* Username + verified */}
          <div className="flex items-center gap-1">
            <h2 className="font-medium text-[#F3F5F7] text-sm sm:text-base">
              {post.author.name}
            </h2>
            <MdVerified className="text-[#3E95EF]" size={16} />
          </div>

          {/* Text */}
          <p className="text-[#F3F5F7] font-medium text-sm sm:text-base">
            {post.content}
          </p>

          {/* Image */}
          {post.image ? (
            <div
              className="w-full relative rounded-[10px] my-2"
              style={{ aspectRatio: "16 / 8" }}
            >
              <Image
                fill
                src="https://ik.imagekit.io/nsux7zbwq/photo-1528758054211-22aa4c5300db.avif?updatedAt=1752333291511"
                alt="My image"
                className="rounded-[10px] object-cover"
              />
            </div>
          ) : (
            ""
          )}

          {/* Action icons */}
          <div className="w-full flex gap-4 h-[40px] items-center">
            {/* like */}
            <div onClick={handleLike} className="cursor-pointer">
              {hasLiked ? (
                <FaHeart size={20} className="text-red-500" />
              ) : (
                <FaRegHeart size={20} className="text-[#e8e8e8]" />
              )}
            </div>

            <MdOutlineModeComment
              size={20}
              className="text-[#e8e8e8] cursor-pointer"
            />
            <LuSendHorizontal
              size={20}
              className="text-[#e8e8e8] cursor-pointer"
            />
          </div>

          {/* Likes and replies */}
          <div className="w-full flex gap-4 items-center">
            <h2 className="text-[#616161] font-medium text-xs sm:text-sm">
              {optimisticLikes} likes
            </h2>
            <h2 className="text-[#616161] font-medium text-xs sm:text-sm">
              {post._count.comments} replies
            </h2>
          </div>
        </div>

        {/* Post options */}
        <div className="flex items-start pt-1">
          {dbUserId === post.authorId ? (
            <div
              className=" cursor-pointer text-red-400"
              onClick={handleDeletePost}
            >
              <PiTrashSimple size={15} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#343638] my-2" />
    </div>
  );
};

export default Post;
