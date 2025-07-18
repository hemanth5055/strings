"use client";
import React, { useState } from "react";
import { PiTrashSimple } from "react-icons/pi";
import { MdVerified } from "react-icons/md";

import { IoArrowForwardOutline } from "react-icons/io5";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import Image from "next/image";
import { deletePost, toggleLike } from "@/actions/post.action";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import PostTime from "./PostTime";
const Post = ({ post, dbUserId }: { post: any; dbUserId: string }) => {
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like: { userId: string }) => like.userId === dbUserId)
  );
  const router = useRouter();
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev: boolean) => !prev);
      setOptmisticLikes((prev: number) => prev + (hasLiked ? -1 : 1));
      const like = await toggleLike(post.id);
    } catch (error) {
      setOptmisticLikes(post._count.likes);
      setHasLiked(
        post.likes.some((like: { userId: string }) => like.userId === dbUserId)
      );
    } finally {
      setIsLiking(false);
    }
  };
  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) {
        toast.success("Deleted post successfully.");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 px-3 md:px-0  mx-auto">
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
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-1">
              <Link
                href={`${
                  dbUserId == post.author.id
                    ? "/profile"
                    : `/user/${post.author.username}`
                }`}
              >
                <h2 className="font-medium dark:text-[#F3F5F7] text-sm sm:text-base">
                  {post.author.name}
                </h2>
              </Link>
              {post.author.isVerified ? (
                <MdVerified className="text-[#3E95EF]" size={16} />
              ) : (
                ""
              )}
            </div>
            <div className="md:flex items-center hidden">
              <PostTime createdAt={post.createdAt} />
            </div>
          </div>

          {/* Text */}
          <p
            className={`dark:text-[#F3F5F7] font-medium text-sm sm:text-base whitespace-pre-wrap overflow-hidden w-full ${
              /\w{30,}/.test(post.content) ? "break-all" : "break-words"
            }`}
          >
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
                <FaRegHeart size={20} className="dark:text-[#F3F5F7]" />
              )}
            </div>

            <div onClick={() => router.push(`/post/${post.id}`)}>
              <IoArrowForwardOutline
                size={20}
                className="dark:text-[#F3F5F7] cursor-pointer rotate-[-45deg]"
              />
            </div>
            {/* <LuSendHorizontal
              size={20}
              className="dark:text-[#F3F5F7] cursor-pointer"
            /> */}
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
