import { getRandomUsers, getUserByClerkId } from "@/actions/user.action";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import { MdVerified } from "react-icons/md";
import FollowBtn from "./FollowBtn";

const RightContent = async () => {
  const authUser = await currentUser();
  if (!authUser) return null;
  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;
  const randomUsers = await getRandomUsers();
  return (
    <div className="w-full flex flex-col px-5 pt-3 gap-5">
      {/* my-info */}
      <div className="flex items-center justify-between">
        {/* details */}
        <div className="flex items-center gap-3 overflow-hidden max-w-[70%]">
          <div className="w-[40px] h-[40px] relative rounded-full bg-gray-800 shrink-0">
            <Image
              fill
              src={user.image}
              alt="profile"
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col max-w-[160px] truncate">
            <div className="flex items-center gap-1">
              <h2 className="text-[15px] font-semibold text-[#F3F5F7] truncate">
                {user.name}
              </h2>
              {user.isVerified ? (
                <MdVerified className="text-[#3E95EF]" size={16} />
              ) : (
                ""
              )}
            </div>
            <h3 className="text-[#999999] text-[13px] font-medium truncate">
              {user.username}
            </h3>
          </div>
        </div>

        {/* logout */}
        <SignOutButton>
          <h2 className="text-[#3E95EF] cursor-pointer font-semibold text-[14px]">
            logout
          </h2>
        </SignOutButton>
      </div>

      <div>
        <h2 className="text-[#999999] font-medium text-md">
          Suggested for you
        </h2>
      </div>

      {/* suggested-users */}
      <div className="flex flex-col gap-4">
        {randomUsers.map((suggestedUser) => (
          <div
            key={suggestedUser.id}
            className="flex items-center justify-between"
          >
            {/* user-details */}
            <div className="flex items-center gap-3 overflow-hidden max-w-[70%]">
              <div className="w-[40px] h-[40px] relative rounded-full bg-gray-800 shrink-0">
                <Image
                  fill
                  src={suggestedUser.image}
                  alt={`${suggestedUser.name}'s profile`}
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col truncate max-w-[160px]">
                <h2 className="text-[15px] font-semibold text-[#F3F5F7] truncate">
                  {suggestedUser.name}
                </h2>
                <h3 className="text-[#999999] text-[13px] font-medium truncate">
                  {suggestedUser.username}
                </h3>
              </div>
            </div>
            {/* follow */}
            <FollowBtn userId={suggestedUser.id}></FollowBtn>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-2 gap-y-1">
        <h3 className="text-[#999999] font-medium text-[12px]">About</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Help</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Press</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">API</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Jobs</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Privacy</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Terms</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Locations</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Languages</h3>
        <h3 className="text-[#999999] font-medium text-[12px]">Meta</h3>
      </div>
    </div>
  );
};

export default RightContent;
