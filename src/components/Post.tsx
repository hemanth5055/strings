import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { MdVerified, MdOutlineModeComment } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import Image from "next/image";

const Post = () => {
  return (
    <div className="w-full flex flex-col gap-2 px-3 md:px-0 max-w-screen-sm mx-auto">
      <div className="w-full flex items-start gap-3 sm:gap-4">
        {/* Profile image */}
        <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] relative rounded-full bg-gray-800 shrink-0">
          <Image
            fill
            src="https://ik.imagekit.io/nsux7zbwq/photo-1528758054211-22aa4c5300db.avif?updatedAt=1752333291511"
            alt="profile"
            className="object-cover rounded-full"
          />
        </div>

        {/* Post content */}
        <div className="flex flex-col gap-1 w-full">
          {/* Username + verified */}
          <div className="flex items-center gap-1">
            <h2 className="font-medium text-[#F3F5F7] text-sm sm:text-base">
              donalleniii
            </h2>
            <MdVerified className="text-[#3E95EF]" size={16} />
          </div>

          {/* Text */}
          <p className="text-[#F3F5F7] font-medium text-sm sm:text-base">
            OMG celebrating over 4000 followers today! Thank you! Enjoy this
            augmented reality real time puppet I made.
          </p>

          {/* Image */}
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

          {/* Action icons */}
          <div className="w-full flex gap-4 h-[40px] items-center">
            <FaRegHeart size={20} className="text-[#F3F5F7] cursor-pointer" />
            <MdOutlineModeComment
              size={20}
              className="text-[#F3F5F7] cursor-pointer"
            />
            <LuSendHorizontal
              size={20}
              className="text-[#F3F5F7] cursor-pointer"
            />
          </div>

          {/* Likes and replies */}
          <div className="w-full flex gap-4 items-center">
            <h2 className="text-[#616161] font-medium text-xs sm:text-sm">
              640 replies
            </h2>
            <h2 className="text-[#616161] font-medium text-xs sm:text-sm">
              12K likes
            </h2>
          </div>
        </div>

        {/* Post options */}
        <div className="flex items-start pt-1">
          <h2 className="text-[#3E95EF] font-semibold text-sm sm:text-base cursor-pointer">
            ...
          </h2>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#343638] my-2" />
    </div>
  );
};

export default Post;
