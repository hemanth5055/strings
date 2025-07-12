import HamMenu from "@/components/HamMenu";
import Post from "@/components/Post";
import Image from "next/image";
import React from "react";
import { IoAttachOutline } from "react-icons/io5";

const Home = () => {
  return (
    <div className="flex flex-col gap-3 w-full h-[98vh] overflow-y-auto max-w-screen-md mx-auto">
      {/* Main content */}
      <div className="max-sm:pt-14 sm:pt-4 px-2 sm:px-4 flex flex-col gap-3">
        {/* post-box */}
        <div className="w-full flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          {/* Profile Image */}
          <div className="w-[36px] sm:w-[40px] h-[36px] sm:h-[40px] relative rounded-full bg-gray-800 shrink-0">
            <Image
              fill
              src="https://ik.imagekit.io/nsux7zbwq/photo-1528758054211-22aa4c5300db.avif?updatedAt=1752333291511"
              alt="profile"
              className="object-cover rounded-full"
            />
          </div>

          {/* Textarea and Attach */}
          <div className="flex flex-col w-full sm:w-[75%] gap-2">
            <textarea
              name="string"
              id="string"
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
          <div className="flex items-center pt-2 sm:pt-0">
            <h2 className="text-[#3E95EF] font-semibold text-sm sm:text-base cursor-pointer">
              Post
            </h2>
          </div>
        </div>

        {/* line */}
        <div className="w-full h-[1px] bg-[#343638] mb-2" />

        {/* posts */}
        <div className="flex flex-col gap-2">
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
        {/* space */}
        <div className="w-full h-[50px]" />
      </div>
    </div>
  );
};

export default Home;
