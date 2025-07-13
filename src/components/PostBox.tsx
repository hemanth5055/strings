"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { IoAttachOutline } from "react-icons/io5";
import { addPost } from "@/actions/post.action";
import toast from "react-hot-toast";

const PostBox = ({ user }: { user: User }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const isPostAdded = await addPost(content);
      if (isPostAdded) {
        toast.success("Added string successfully.");
      } else {
        toast.error("Failed to add string.");
      }
      setContent(""); // Clear textarea after posting
    } catch (err) {
      console.error("Failed to post:", err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
      {/* Profile Image */}
      <div className="w-[36px] sm:w-[40px] h-[36px] sm:h-[40px] relative rounded-full bg-gray-800 shrink-0">
        <Image
          fill
          src={user.image}
          alt="profile"
          className="object-cover rounded-full"
        />
      </div>

      {/* Textarea and Attach */}
      <div className="flex flex-col w-full sm:w-[75%] gap-2">
        <textarea
          name="string"
          id="string"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none w-full h-[75px] outline-none placeholder:text-[#5F5F5F] font-medium text-[#F3F5F7] bg-transparent text-sm sm:text-base"
          placeholder="What's on your mind?"
        />
        <div className="w-full flex justify-start">
          <div className="h-[40px] flex items-center">
            <IoAttachOutline size={20} className="text-[#7b7b7b]" />
          </div>
        </div>
      </div>

      {/* Post button */}
      <div className="flex items-center pt-2 sm:pt-0 cursor-pointer">
        <h2
          onClick={handlePost}
          className={`text-[#3E95EF] font-semibold text-sm sm:text-base ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </h2>
      </div>
    </div>
  );
};

export default PostBox;
