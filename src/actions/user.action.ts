"use server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Now replaced with webhooks
// export async function syncUser() {
//   try {
//     const { userId } = await auth();
//     const user = await currentUser();
//     if (!userId || !user) throw new Error("Unauthorized");

//     const existingUser = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     });

//     if (existingUser) return { success: true, user: existingUser };

//     const dbUser = await prisma.user.create({
//       data: {
//         clerkId: userId,
//         name: `${user.firstName || ""} ${user.lastName || ""}`,
//         username:
//           user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
//         email: user.emailAddresses[0].emailAddress,
//         image: user.imageUrl,
//       },
//     });

//     return { success: true, user: dbUser };
//   } catch (error) {
//     console.error("syncUser error:", error);
//     return { success: false, error: "Failed to sync user" };
//   }
// }

// ✅ Get User By Clerk ID
export async function getUserByClerkId(clerkId: string) {
  try {
    const res = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        isVerified: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
    if (!res) {
      return { success: false };
    }
    return { success: true, user: res };
  } catch (error) {
    console.error("getUserByClerkId error:", error);
    return { success: false, error: "Failed to get user" };
  }
}

// ✅ Get DB User ID
export async function getDbUserId() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const res = await getUserByClerkId(clerkId);
    if (!res.success || !res.user) throw new Error("User not found");

    return { success: true, userId: res.user.id };
  } catch (error) {
    console.error("getDbUserId error:", error);
    return { success: false, error: "Failed to fetch user ID" };
  }
}

// ✅ Get Random Users
export async function getRandomUsers() {
  try {
    const { success, userId, error } = await getDbUserId();
    if (!success || !userId) throw new Error(error || "Invalid user");

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
        isVerified: true,
      },
      take: 3,
    });

    return { success: true, users: randomUsers };
  } catch (error) {
    console.error("getRandomUsers error:", error);
    return { success: false, error: "Failed to fetch random users" };
  }
}

// ✅ Toggle Follow
export async function toggleFollow(targetUserId: string) {
  try {
    const { success, userId, error } = await getDbUserId();
    if (!success || !userId) throw new Error(error || "Invalid user");
    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followeeId: targetUserId,
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      return { success: true, code: 0 }; // Unfollowed
    } else {
      await prisma.follow.create({
        data: {
          followerId: userId,
          followeeId: targetUserId,
        },
      });
      return { success: true, code: 1 }; // Followed
    }
  } catch (error) {
    console.error("toggleFollow error:", error);
    return { success: false, error: "Failed to toggle follow" };
  }
}

// ✅ Get User By Username
export async function getUserByUsername(
  username: string,
  currentUserId: string
) {
  try {
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

    if (!targetUser) throw new Error("User not found");

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

    const user = {
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

    return { success: true, user };
  } catch (error) {
    console.error("getUserByUsername error:", error);
    return { success: false, error: "Failed to fetch user by username" };
  }
}
