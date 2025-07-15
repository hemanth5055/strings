"use client";
import React, { useState } from "react";
import { PiTrashSimple } from "react-icons/pi";
import { MdVerified, MdOutlineModeComment } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import Image from "next/image";
import {
  addComment,
  deleteComment,
  deletePost,
  toggleLike,
} from "@/actions/post.action";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect } from "next/navigation";

const SpecificPost = ({ post, dbUserId }: { post: any; dbUserId: string }) => {
  if (!post) return null;
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like: { userId: string }) => like.userId === dbUserId)
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [comment, setComment] = useState("");

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like: any) => like.userId === dbUserId));
      toast.error("Failed to update like");
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
        redirect("/"); // optional: navigate away
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("Unexpected error deleting post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async () => {
    if (isCommenting || comment.trim() === "") return;
    try {
      setIsCommenting(true);
      const result = await addComment(post.id, dbUserId, comment.trim());
      if (result.success) {
        toast.success("Comment added.");
        setComment("");
        // Optionally refetch or update comments state here
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      toast.error("Error adding comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelComment = async (commentId: string) => {
    if (isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await deleteComment(commentId);
      if (result.success) {
        toast.success("Comment deleted.");
        // Optionally refetch or remove comment from local state
      } else {
        toast.error(result.error || "Failed to delete comment");
      }
    } catch (error) {
      toast.error("Error deleting comment");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 px-3 md:px-0">
      {/* Post Header */}
      <div className="w-full flex items-start gap-3 sm:gap-4">
        <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] relative rounded-full bg-gray-800 shrink-0">
          <Image
            fill
            src={post.author.image}
            alt="profile"
            className="object-cover rounded-full"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-1">
            <Link
              href={
                dbUserId === post.author.id
                  ? "/profile"
                  : `/user/${post.author.username}`
              }
            >
              <h2 className="font-medium dark:text-[#F3F5F7] text-sm sm:text-base">
                {post.author.name}
              </h2>
            </Link>
            {post.author.isVerified && (
              <MdVerified className="text-[#3E95EF]" size={16} />
            )}
          </div>

          <p className="dark:text-[#F3F5F7] font-medium text-sm sm:text-base">
            {post.content}
          </p>

          {post.image && (
            <div
              className="w-full relative rounded-[10px] my-2"
              style={{ aspectRatio: "16 / 8" }}
            >
              <Image
                fill
                src={post.image}
                alt="Post image"
                className="rounded-[10px] object-cover"
              />
            </div>
          )}

          <div className="w-full flex gap-4 h-[40px] items-center">
            <div onClick={handleLike} className="cursor-pointer">
              {hasLiked ? (
                <FaHeart size={20} className="text-red-500" />
              ) : (
                <FaRegHeart size={20} className="dark:text-[#e8e8e8]" />
              )}
            </div>
            <MdOutlineModeComment
              size={20}
              className="dark:text-[#e8e8e8] cursor-pointer"
            />
            <LuSendHorizontal
              size={20}
              className="dark:text-[#e8e8e8] cursor-pointer"
            />
          </div>

          <div className="w-full flex gap-4 items-center">
            <h2 className="text-[#616161] font-medium text-xs sm:text-sm">
              {optimisticLikes} likes
            </h2>
            <h2 className="text-[#616161] font-medium text-xs sm:text-sm">
              {post._count.comments} replies
            </h2>
          </div>
        </div>

        {dbUserId === post.authorId && (
          <div
            className="cursor-pointer text-red-400 pt-1"
            onClick={handleDeletePost}
          >
            <PiTrashSimple size={15} />
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="w-full flex">
        <div className="w-[40px] flex justify-center">
          <div className="w-[2px] dark:bg-gray-600 bg-gray-300 h-full" />
        </div>

        <div className="w-full flex flex-col gap-3 pl-4 my-3">
          {/* Input */}
          <div className="w-full flex items-center gap-4">
            <textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment ..."
              className="md:w-[60%] w-[75%] md:h-[70px] h-[60px] p-2 dark:bg-[#202020] bg-[#ececec] resize-none outline-none font-medium md:text-[16px] text-[14px] rounded-[10px] px-4"
            />
            <div onClick={handleAddComment} className="cursor-pointer">
              <h1 className="text-[#3E95EF] font-semibold">Post</h1>
            </div>
          </div>

          {/* Existing Comments */}
          <div className="w-full flex flex-col gap-6">
            {post.comments.map((cmt: any) => (
              <div className="w-full flex md:gap-4 gap-2" key={cmt.id}>
                <div className="w-[40px] relative h-[40px] shrink-0 rounded-full">
                  <Image
                    fill
                    src={cmt.user.image}
                    alt="profile"
                    className="object-cover rounded-full"
                  />
                </div>

                <div className="w-full flex flex-col gap-[2px]">
                  <div className="w-full flex gap-1 items-center">
                    <Link
                      href={
                        dbUserId === cmt.user.id
                          ? "/profile"
                          : `/user/${cmt.user.username}`
                      }
                    >
                      <h2 className="font-medium dark:text-[#F3F5F7] text-sm sm:text-base">
                        {cmt.user.name}
                      </h2>
                    </Link>
                    {cmt.user.isVerified && (
                      <MdVerified className="text-[#3E95EF]" size={16} />
                    )}
                  </div>

                  <p className="dark:text-[#F3F5F7] font-medium text-sm sm:text-base">
                    {cmt.content}
                  </p>
                </div>

                {dbUserId === cmt.user.id && (
                  <div
                    className="cursor-pointer text-red-400 pt-1"
                    onClick={() => handleDelComment(cmt.id)}
                  >
                    <PiTrashSimple size={15} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificPost;
