"use client";
import FollowBtn from "@/components/FollowBtn";
import React, { useState } from "react";

const page = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="w-full flex flex-col pt-3 gap-4">
      {/* searchbar */}
      <div className="w-full flex">
        <input
          type="text"
          placeholder="Enter the username"
          className="h-[40px] w-[75%] rounded-[20px] px-4 font-medium outline-none bg-[#232323]"
        />
      </div>

      {/* display users */}
      <div className="w-[full] my-2 grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between col-span-1 gap-3 flex-col hover:bg-[#232323] py-3 rounded-[15px]">
          {/* show-image */}
          <div className="w-full flex justify-center items-center">
            <div className="w-[50px] h-[50px] bg-gray-600 rounded-full "></div>
          </div>

          {/* show-name-and-username */}
          <div className="flex justify-center items-center gap-1 flex-col">
            <h2 className="text-[15px] font-semibold text-[#F3F5F7] truncate">
              Hemanth Reddy
            </h2>
            <h3 className="text-[#999999] text-[13px] font-medium truncate">
              userhemanth
            </h3>
          </div>
          <FollowBtn userId="123"></FollowBtn>
        </div>
      </div>
    </div>
  );
};

export default page;
