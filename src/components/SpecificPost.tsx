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
  getAllPosts,
  getPostById,
  toggleLike,
} from "@/actions/post.action";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect } from "next/navigation";
type PostType = Awaited<ReturnType<typeof getPostById>>;

const SpecificPost = ({
  post,
  dbUserId,
}: {
  post: PostType;
  dbUserId: string;
}) => {
  if (!post) return ""; //dummy
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setisCommenting] = useState(false);
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);
  const [comment, setComment] = useState("");

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      const like = await toggleLike(post.id);
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
  const handleAddComment = async () => {
    if (isCommenting) return;
    try {
      setisCommenting(true);
      const result = await addComment(post.id, dbUserId, comment);
      if (result.success) {
        toast.success("Comment Added successfully.");
        setComment("");
      } else {
        toast.error("Failed to Add Comment");
      }
    } catch (error) {
      toast.error("Failed to Add Comment");
    } finally {
      setisCommenting(false);
    }
  };

  const handleDelComment = async (commentId: string) => {
    if (isCommenting) return;
    try {
      setisCommenting(true);
      const result = await deleteComment(commentId);
      if (result.success) {
        toast.success("Comment Deleted successfully.");
        setComment("");
      } else {
        toast.error("Failed to Deleter Comment");
      }
    } catch (error) {
    } finally {
      setisCommenting(false);
    }
  };
  return (
    <div className="w-full flex flex-col gap-2 px-3 md:px-0 ">
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

          {/* Text */}
          <p className="dark:text-[#F3F5F7] font-medium text-sm sm:text-base">
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
                <FaRegHeart size={20} className="dark:text-[#e8e8e8]" />
              )}
            </div>

            <div onClick={() => redirect(`/post/${post.id}`)}>
              <MdOutlineModeComment
                size={20}
                className="dark:text-[#e8e8e8] cursor-pointer"
              />
            </div>
            <LuSendHorizontal
              size={20}
              className="dark:text-[#e8e8e8] cursor-pointer"
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

      {/* comments */}
      <div className="w-full flex">
        {/* vertical line on the left */}
        <div className="w-[40px] flex justify-center">
          <div className="w-[2px] dark:bg-gray-600  bg-gray-300 h-full" />
        </div>

        {/* comments-input-and-comments */}
        <div className="w-full flex flex-col gap-3 pl-4 my-3">
          {/* input */}
          <div className="w-full flex items-center gap-4">
            <textarea
              name="comment"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment ..."
              className="md:w-[60%]  w-[75%] md:h-[70px] h-[60px] p-2 dark:bg-[#202020] resize-none bg-[#ececec] outline-none font-medium md:text-[16px] text-[14px] rounded-[10px] px-4"
            ></textarea>
            <div onClick={handleAddComment} className="cursor-pointer">
              <h1 className="text-[#3E95EF] font-semibold">Post</h1>
            </div>
          </div>
          {/* show-existing-comments */}
          <div className="w-full flex flex-col gap-6">
            {post.comments.map((cmt) => {
              return (
                <div className="w-full flex md:gap-4 gap-2" key={cmt.id}>
                  {/* image */}
                  <div className="w-[40px] relative h-[40px] shrink-0 rounded-full ">
                    <Image
                      fill
                      src={cmt.user.image}
                      alt="profile"
                      className="object-cover rounded-full"
                    />
                  </div>
                  {/* content */}
                  <div className="w-full flex flex-col gap-[2px]">
                    <div className=" w-full flex gap-1 items-center">
                      <Link
                        href={`${
                          dbUserId == cmt.user.id
                            ? "/profile"
                            : `/user/${cmt.user.username}`
                        }`}
                      >
                        <h2 className="font-medium dark:text-[#F3F5F7] text-sm sm:text-base">
                          {cmt.user.name}
                        </h2>
                      </Link>
                      {cmt.user.isVerified ? (
                        <MdVerified className="text-[#3E95EF]" size={16} />
                      ) : (
                        ""
                      )}
                    </div>
                    {/* comment-message */}
                    <div className="w-full">
                      <p className="dark:text-[#F3F5F7] font-medium text-sm sm:text-base">
                        {cmt.content}
                      </p>
                    </div>
                  </div>
                  {/* delete-option */}
                  <div className="flex items-start pt-1">
                    {dbUserId === cmt.user.id ? (
                      <div
                        className=" cursor-pointer text-red-400"
                        onClick={() => handleDelComment(cmt.id)}
                      >
                        <PiTrashSimple size={15} />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificPost;
