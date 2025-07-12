import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBar";
import RightContent from "@/components/RightContent";
import HamMenu from "@/components/HamMenu";

const mont = Montserrat({
  variable: "--font-mont",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strings | &",
  description: "A modern social media app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${mont.variable} overflow-y-hidden`}>
        <div className="h-screen w-full grid md:grid-cols-12 grid-cols-6 m-auto md:p-6 p-2">
          {/* left-sidebar */}
          <div className="col-span-3 hidden md:flex">
            <SideBar></SideBar>
          </div>
          {/* -sidebar */}
          <div className="col-span-6 md:flex ">
            <HamMenu></HamMenu>
            {children}
          </div>
          {/* right-sidebar */}
          <div className="col-span-3 hidden md:flex">
            <RightContent></RightContent>
          </div>
        </div>
      </body>
    </html>
  );
}
