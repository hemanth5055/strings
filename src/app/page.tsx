import HamMenu from "@/components/HamMenu";
import Post from "@/components/Post";
import SignIn from "@/components/SignIn";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import { IoAttachOutline } from "react-icons/io5";
import { getUserByClerkId, syncUser } from "@/actions/user.action";

const Home = async () => {
  const doesUserExists = await currentUser();
  if (!doesUserExists) {
    return <SignIn></SignIn>;
  }
  await syncUser(); //used instead of webhooks
  const user = await getUserByClerkId(doesUserExists.id);
  if (!user) return;
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
