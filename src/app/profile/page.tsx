import { getUserByClerkId } from "@/actions/user.action";
import SignIn from "@/components/SignIn";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import React from "react";
import Loading from "@/components/Loading";
import {UserPosts} from "@/components/UserPosts";

const User = async () => {
  const auth = await currentUser();
  if (!auth) return <SignIn />;

  const { success, user } = await getUserByClerkId(auth.id);
  if (!success || !user) return <SignIn />;

  return (
    <div className="w-full flex pt-5 flex-col gap-4 items-center max-sm:pt-10">
      {/* image */}
      <div className="w-full flex justify-center">
        <div className="h-[100px] w-[100px] relative rounded-full bg-amber-200">
          <Image
            fill
            alt="user_image"
            className="rounded-full object-cover"
            src={user.image}
          />
        </div>
      </div>

      {/* details */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7] truncate">
            {user.name}
          </h2>
          {user.isVerified && (
            <MdVerified className="text-[#3E95EF]" size={16} />
          )}
        </div>
        <h3 className="text-[#999999] text-[15px] font-medium truncate">
          {user.username}
        </h3>
      </div>

      {/* followers and following */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <h3 className="text-[#999999] text-[15px] font-medium truncate">
            Following
          </h3>
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7] truncate">
            {user._count.following}
          </h2>
        </div>
        <div className="h-full w-[1px] bg-[#343638]" />
        <div className="flex flex-col items-center">
          <h3 className="text-[#999999] text-[15px] font-medium truncate">
            Followers
          </h3>
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7] truncate">
            {user._count.followers}
          </h2>
        </div>
      </div>

      {/* posts */}
      <div className="w-full mt-5">
        <React.Suspense fallback={<Loading />}>
          <UserPosts reqUserId={user.id} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default User;
