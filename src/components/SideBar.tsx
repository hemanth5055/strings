import Link from "next/link";
import React from "react";
import { FiHome } from "react-icons/fi";
import { CgSearch } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa6";
import Image from "next/image";
import { getUserByClerkId } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

const SideBar = async () => {
  const authUser = await currentUser();
  if (!authUser) return null;
  const { success, user } = await getUserByClerkId(authUser.id);
  if (!success || !user) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* symbol */}
      <h1 className="font-medium text-[30px] px-2 mb-4 text-black dark:text-[#F3F5F7]">
        & Strings
      </h1>

      {/* home */}
      <Link className="w-full flex items-center gap-2" href="/">
        <div className="w-[40px] h-[40px] flex justify-center items-center">
          <FiHome size={20} />
        </div>
        <h3 className="font-semibold text-black dark:text-[#F3F5F7]">Home</h3>
      </Link>

      {/* search */}
      <Link className="w-full flex items-center gap-2" href="/search">
        <div className="w-[40px] h-[40px] flex justify-center items-center">
          <CgSearch size={25} />
        </div>
        <h3 className="font-semibold text-black dark:text-[#F3F5F7]">Search</h3>
      </Link>

      {/* activity */}
      <Link className="w-full flex items-center gap-2" href="/activity">
        <div className="w-[40px] h-[40px] flex justify-center items-center">
          <FaRegHeart size={20} />
        </div>
        <h3 className="font-semibold text-black dark:text-[#F3F5F7]">
          Activity
        </h3>
      </Link>

      {/* profile */}
      <Link className="w-full flex items-center gap-2" href="/profile">
        <div className="w-[40px] h-[40px] flex justify-center items-center">
          <div className="w-[30px] relative h-[30px] rounded-full">
            <Image
              fill
              src={user.image}
              alt="profile"
              className="object-cover rounded-full"
            />
          </div>
        </div>
        <h3 className="font-semibold text-black dark:text-[#F3F5F7]">
          Profile
        </h3>
      </Link>
    </div>
  );
};

export default SideBar;
