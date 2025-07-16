import { getUserByClerkId, getUserByUsername } from "@/actions/user.action";
import SignIn from "@/components/SignIn";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import React from "react";
import FollowBtn from "@/components/FollowBtn";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import { UserPosts } from "@/components/UserPosts";

const User = async ({ params }: { params: Promise<{ userName: string }> }) => {
  // Get currently logged in Clerk user
  const authUser = await currentUser();
  if (!authUser) return <SignIn />;

  // Get the logged-in user's database record
  const loggedInUserRes = await getUserByClerkId(authUser.id);
  if (!loggedInUserRes?.success || !loggedInUserRes.user) return <SignIn />;

  const dbUser = loggedInUserRes.user;

  // Check if visiting own profile
  const { userName } = await params;
  if (userName === dbUser.username) {
    redirect("/profile");
  }

  // Get requested user's data
  const res = await getUserByUsername(userName, dbUser.id);
  if (!res.success || !res.user)
    return (
      <h1 className="text-center pt-20 text-xl font-semibold">No user found</h1>
    );

  const targetUser = res.user;

  return (
    <div className="w-full flex pt-5 flex-col gap-4 items-center max-sm:pt-10">
      {/* Profile image */}
      <div className="w-full flex justify-center">
        <div className="h-[100px] w-[100px] relative rounded-full bg-amber-200">
          <Image
            fill
            alt="user_image"
            className="rounded-full object-cover"
            src={targetUser.image}
          />
        </div>
      </div>

      {/* Name and username */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7] truncate">
            {targetUser.name}
          </h2>
          {targetUser.isVerified && (
            <MdVerified className="text-[#3E95EF]" size={16} />
          )}
        </div>
        <h3 className="text-[#999999] text-[15px] font-medium truncate">
          {targetUser.username}
        </h3>
      </div>

      {/* Follower stats */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <h3 className="text-[#999999] text-[15px] font-medium">Following</h3>
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7]">
            {targetUser._count.following}
          </h2>
        </div>
        <div className="h-full w-[1px] bg-[#343638]" />
        <div className="flex flex-col items-center">
          <h3 className="text-[#999999] text-[15px] font-medium">Followers</h3>
          <h2 className="text-[20px] font-semibold dark:text-[#F3F5F7]">
            {targetUser._count.followers}
          </h2>
        </div>
      </div>

      {/* Follow/Unfollow button */}
      <div className="flex gap-2">
        <FollowBtn
          alreadyFollowing={targetUser.weFollowingUser}
          userId={targetUser.id}
        />
      </div>

      {/* User's Posts */}
      <div className="w-full mt-5">
        <React.Suspense fallback={<Loading />}>
          <UserPosts reqUserId={targetUser.id} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default User;
