"use server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}
export async function getUserByClerkId(clerkId: string) {
  try {
    const res = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error("User not found");
  return user.id;
}
export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    // get 3 random users exclude ourselves & users that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      take: 3,
    });
    return randomUsers;
  } catch (error) {
    console.log("Error fetching random users", error);
    return [];
  }
}
export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    if (userId === targetUserId) {
      throw new Error("You cannot follow yourself");
    }
    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followeeId: targetUserId,
      },
    });
    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      return { success: true, code: 0 };
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: userId,
          followeeId: targetUserId,
        },
      });
      return { success: true, code: 1 };
    }
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    return { success: false, error: "Error toggling follow" };
  }
}
export async function getUserByUsername(
  username: string,
  currentUserId: string
) {
  const targetUser = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });

  if (!targetUser) return null;

  const [weFollowingUser, isFollowingUs] = await Promise.all([
    prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followeeId: targetUser.id,
      },
    }),
    prisma.follow.findFirst({
      where: {
        followerId: targetUser.id,
        followeeId: currentUserId,
      },
    }),
  ]);

  return {
    id: targetUser.id,
    name: targetUser.name,
    username: targetUser.username,
    image: targetUser.image,
    isVerified: targetUser.isVerified,
    posts: targetUser.posts,
    _count: targetUser._count,
    isFollowingUs: !!isFollowingUs,
    weFollowingUser: !!weFollowingUser,
  };
}

export async function searchUsers(query: string) {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      isVerified: true,
    },
  });
}
