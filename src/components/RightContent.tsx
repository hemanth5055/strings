import Image from "next/image";
import React from "react";

const RightContent = () => {
  return (
    <div className="w-full flex flex-col px-8 pt-3 gap-5">
      {/* my-info */}
      <div className="flex items-center justify-between ">
        {/* details */}
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] relative rounded-full bg-gray-800">
            <Image
              fill
              src={
                "https://ik.imagekit.io/nsux7zbwq/photo-1528758054211-22aa4c5300db.avif?updatedAt=1752333291511"
              }
              alt="profile"
              className="object-cover rounded-full"
            ></Image>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] font-semibold text-[#F3F5F7]">
              Hemanth Reddy
            </h2>
            <h3 className="text-[#999999] text-[13px] font-medium">
              yourshemu
            </h3>
          </div>
        </div>
        {/* logout */}
        <h2 className="text-[#3E95EF] font-semibold text-[14px]">logout</h2>
      </div>

      <div>
        <h2 className="text-[#999999] font-medium text-md">
          Suggested for you
        </h2>
      </div>

      {/* suggested-users */}
      <div>
        <div className="flex items-center justify-between ">
          {/* user-details */}
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-gray-800"></div>
            <div className="flex flex-col">
              <h2 className="text-[15px] font-semibold text-[#F3F5F7]">
                Abhi ram
              </h2>
              <h3 className="text-[#999999] text-[13px] font-medium">
                abhistr
              </h3>
            </div>
          </div>
          {/* follow */}
          <button className="border-1 px-3 cursor-pointer py-1 rounded-[10px] border-[#323232]">
            follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightContent;
