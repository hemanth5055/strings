"use client";
import { toggleFollow } from "@/actions/user.action";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FollowBtn = ({
  userId,
  alreadyFollowing,
}: {
  userId: string;
  alreadyFollowing: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (alreadyFollowing) {
      setMessage("Unfollow");
    } else {
      setMessage("Follow");
    }
  }, []);
  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const res = await toggleFollow(userId);
      if (res && res.success) {
        if (res.code == 0) {
          setMessage("follow");
          toast.success("Unfollowed successfully");
        } else {
          setMessage("Unfollow");
          toast.success("Followed successfully");
        }
      }
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
        message
      )}
    </button>
  );
};

export default FollowBtn;
