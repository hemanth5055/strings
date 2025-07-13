"use client";
import { toggleFollow } from "@/actions/user.action";
import React, { useState } from "react";

const FollowBtn = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleFollow = async () => {
    setIsLoading(true);
    try {
      await toggleFollow(userId);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className="border-1 px-3 cursor-pointer py-1 rounded-[10px] border-[#323232] hover:bg-[#292929] transition "
      onClick={handleFollow}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowBtn;
