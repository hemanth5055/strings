"use client";

import Link from "next/link";
import React, { useState } from "react";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { CgSearch } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa6";
import { IoArrowForwardOutline } from "react-icons/io5";

const HamMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => {
    setIsOpen(false);
  };
  return (
    <>
      {/* Top Nav Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-12 z-50 backdrop-blur-lg flex justify-end items-center px-4 ">
        <button
          className="w-[36px] h-[36px] flex justify-center items-center"
          onClick={() => setIsOpen(true)}
        >
          <CgMenuRight className="dark:text-[#D4D4D4] text-black" size={24} />
        </button>
      </div>

      {/* Sidebar + Backdrop */}
      {isOpen && (
        <>
          {/* Blurred Backdrop */}
          <div
            className="fixed top-0 left-0 w-full h-screen bg-white/40 dark:bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed top-0 right-0 w-64 h-screen dark:bg-black bg-gray-100 z-50 p-4 flex flex-col gap-4 text-white shadow-lg transition-transform">
            <div className="flex justify-end items-center">
              <button onClick={() => setIsOpen(false)}>
                <IoClose size={24} className="text-black dark:text-[#F3F5F7]" />
              </button>
            </div>
            {/* Sidebar content */}
            <div className="w-full flex flex-col gap-3">
              {/* symbol */}
              <h1 className="font-medium text-[30px] px-2 mb-4 text-black dark:text-[#F3F5F7]">
                & Strings
              </h1>

              {/* home */}
              <Link
                className="w-full flex items-center gap-2"
                href="/"
                onClick={closeSidebar}
              >
                <div className="w-[40px] h-[40px] flex justify-center items-center">
                  <FiHome size={20} className="text-black dark:text-[#F3F5F7]" />
                </div>
                <h3 className="font-semibold dark:text-[#F3F5F7] text-black">
                  Home
                </h3>
              </Link>

              {/* search */}
              <Link
                className="w-full flex items-center gap-2"
                href="/search"
                onClick={closeSidebar}
              >
                <div className="w-[40px] h-[40px] flex justify-center items-center">
                  <CgSearch size={25} className="text-black dark:text-[#F3F5F7]" />
                </div>
                <h3 className="font-semibold dark:text-[#F3F5F7] text-black">
                  Search
                </h3>
              </Link>

              {/* activity */}
              <Link
                className="w-full flex items-center gap-2"
                href="/activity"
                onClick={closeSidebar}
              >
                <div className="w-[40px] h-[40px] flex justify-center items-center">
                  <FaRegHeart size={20} className="text-black dark:text-[#F3F5F7]" />
                </div>
                <h3 className="font-semibold dark:text-[#F3F5F7] text-black">
                  Activity
                </h3>
              </Link>

              {/* profile */}
              <Link
                className="w-full flex items-center gap-2"
                href="/profile"
                onClick={closeSidebar}
              >
                <div className="w-[40px] h-[40px] flex justify-center items-center">
                  <IoArrowForwardOutline
                    size={20}
                    className="rotate-[-45deg] text-black dark:text-[#F3F5F7]"
                  ></IoArrowForwardOutline>
                </div>
                <h3 className="font-semibold dark:text-[#F3F5F7] text-black">
                  Profile
                </h3>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HamMenu;
