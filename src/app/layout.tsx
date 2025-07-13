import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBar";
import RightContent from "@/components/RightContent";
import HamMenu from "@/components/HamMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`antialiased ${mont.variable} overflow-y-hidden`}>
          <Toaster position="top-right"></Toaster>
          <div className="h-screen w-full grid md:grid-cols-16 grid-cols-6 m-auto md:p-6 p-2">
            {/* left-sidebar */}
            <div className="col-span-3 hidden md:flex">
              <SideBar></SideBar>
            </div>
            {/* -sidebar */}
            <div className="col-span-9 md:flex ">
              <HamMenu></HamMenu>
              {children}
            </div>
            {/* right-sidebar */}
            <div className="col-span-4 hidden md:flex">
              <RightContent></RightContent>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
