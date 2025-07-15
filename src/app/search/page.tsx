"use client";
import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

const Page = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setUsers([]);
      if (searchTerm.trim() === "") return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search-users?q=${searchTerm}`);
        const result = await res.json();
        if (result.length === 0) toast.error("No users found");
        setUsers(result);
      } catch (err) {
        toast.error("Search failed");
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="w-full flex flex-col gap-4 px-4 mt-12">
      {/* searchbar */}
      <div className="w-full flex gap-2 items-center justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter the username"
          className="h-[50px] md:w-[60%] w-[80%] rounded-[20px] px-4 font-medium outline-none dark:bg-[#232323] bg-gray-200 text-black  dark:text-white"
        />
      </div>

      {/* user list */}
      <div className="w-full flex flex-col gap-2 mt-4">
        {isLoading ? <Loading></Loading> : ""}
        {users.map((user) => (
          <div
            key={user.id}
            className="w-full flex items-center justify-between px-4 py-3 rounded-[10px] hover:dark:bg-[#232323] hover:bg-gray-200 transition cursor-pointer"
            onClick={() => {
              redirect(`/user/${user.username}`);
            }}
          >
            {/* user avatar + info */}
            <div className="flex items-center gap-4">
              <img
                src={user.image}
                alt={user.username}
                className="w-[45px] h-[45px] rounded-full object-cover"
              />
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-center">
                  <h2 className="text-[16px] font-semibold dark:text-[#F3F5F7] truncate">
                    {user.name}
                  </h2>
                  {user.isVerified ? (
                    <MdVerified className="text-[#3E95EF]" size={16} />
                  ) : (
                    ""
                  )}
                </div>

                <h3 className="text-[#999999] text-xs font-medium truncate">
                  {user.username}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
