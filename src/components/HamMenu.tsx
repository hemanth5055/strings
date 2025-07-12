"use client";
import React, { useState } from "react";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import SideBar from "./SideBar";

const HamMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Nav Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-12 z-50 backdrop-blur-lg flex justify-end items-center px-4 shadow-md">
        <button
          className="w-[36px] h-[36px] flex justify-center items-center"
          onClick={() => setIsOpen(true)}
        >
          <CgMenuRight className="text-[#D4D4D4]" size={24} />
        </button>
      </div>

      {/* Sidebar + Backdrop */}
      {isOpen && (
        <>
          {/* Blurred Backdrop */}
          <div
            className="fixed top-0 left-0 w-full h-screen bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed top-0 right-0 w-64 h-screen bg-black z-50 p-4 flex flex-col gap-4 text-white shadow-lg transition-transform">
            <div className="flex justify-end items-center">
              <button onClick={() => setIsOpen(false)}>
                <IoClose size={24} />
              </button>
            </div>
            {/* Sidebar content */}
            <SideBar></SideBar>
          </div>
        </>
      )}
    </>
  );
};

export default HamMenu;
