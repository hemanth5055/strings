import SignIn from "@/components/SignIn";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

import { getUserByClerkId, syncUser } from "@/actions/user.action";
import Posts from "@/components/Posts";
import PostBox from "@/components/PostBox";
import Loading from "@/components/Loading";

const Home = async () => {
  const doesUserExists = await currentUser();
  if (!doesUserExists) {
    return <SignIn></SignIn>;
  }
  await syncUser(); //used instead of webhooks
  const user = await getUserByClerkId(doesUserExists.id);
  if (!user) return;
  return (
    <div className="flex flex-col gap-3 w-full h-[98vh] overflow-y-auto max-w-screen-md mx-auto">
      {/* Main content */}
      <div className="pt-3 px-2 sm:px-4 flex flex-col gap-3">
        {/* post-box */}
        <PostBox user={user}></PostBox>
        {/* line */}
        <div className="w-full h-[1px] bg-[#343638] mb-2" />
        {/* posts */}
        <React.Suspense fallback={<Loading></Loading>}>
          <Posts></Posts>
        </React.Suspense>
        {/* space */}
        <div className="w-full h-[50px]" />
      </div>
    </div>
  );
};

export default Home;
