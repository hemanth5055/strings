import { getUserByClerkId, getUserByUsername } from "@/actions/user.action";
import SignIn from "@/components/SignIn";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import React from "react";
import FollowBtn from "@/components/FollowBtn";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import UserPosts from "@/components/UserPosts";

const User = async ({ params }: { params: Promise<{ userName: string }> }) => {
  const auth = await currentUser();
  if (!auth) {
    return <SignIn></SignIn>;
  }
  const log_user = await getUserByClerkId(auth.id);
  if (!log_user) {
    return <SignIn></SignIn>;
  }
  const { userName } = await params;
  if (userName == log_user.username) {
    redirect("/profile");
  }
  const req_user = await getUserByUsername(userName, log_user.id);
  if (!req_user) {
    return <h1>No user Found</h1>;
  }

  return (
    <div className="w-full flex pt-5 flex-col gap-4 items-center max-sm:pt-10">
      {/* image */}
      <div className="w-full flex justify-center">
        <div className="h-[100px] w-[100px] relative rounded-full bg-amber-200">
          <Image
            fill
            alt="user_image"
            className="rounded-full object-cover"
            src={req_user.image}
          ></Image>
        </div>
      </div>
      {/* details */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7] truncate">
            {req_user.name}
          </h2>
          {req_user.isVerified ? (
            <MdVerified className="text-[#3E95EF]" size={16} />
          ) : (
            ""
          )}
        </div>
        <h3 className="text-[#999999] text-[15px] font-medium truncate">
          {req_user.username}
        </h3>
      </div>

      {/* followers and following */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col  items-center">
          <h3 className="text-[#999999] text-[15px] font-medium truncate">
            Following
          </h3>
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7] truncate">
            {req_user._count.following}
          </h2>
        </div>

        <div className="h-full w-[1px] bg-[#343638]"></div>
        <div className="flex flex-col  items-center">
          <h3 className="text-[#999999] text-[15px] font-medium truncate">
            Followers
          </h3>
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7] truncate">
            {req_user._count.followers}
          </h2>
        </div>
      </div>

      {/* follow and following */}
      <div className="flex gap-2">
        <FollowBtn
          alreadyFollowing={req_user.weFollowingUser}
          userId={req_user.id}
        ></FollowBtn>
      </div>

      <div className="w-full mt-5">
        <React.Suspense fallback={<Loading></Loading>}>
          <UserPosts reqUserId={req_user.id}></UserPosts>
        </React.Suspense>
      </div>
    </div>
  );
};

export default User;
