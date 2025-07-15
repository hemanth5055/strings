"use server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export async function getAllPosts() {
  const user = await currentUser();
  if (!user) return [];
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          isVerified: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: true,
      comments: true,
    },
  });
  return posts;
}
export async function getAllPostsOfuser(userId: string) {
  const user = await currentUser();
  if (!user) return [];
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          isVerified: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: true,
      comments: true,
    },
  });
  return posts;
}

export async function addPost(content: string, image?: string) {
  const user = await currentUser();
  if (!user) return false;
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) return false;
  await prisma.post.create({
    data: {
      content,
      image: image || null,
      authorId: dbUser.id,
    },
  });
  revalidatePath("/");
  return true;
}

export async function toggleLike(postId: string) {
  const user = await currentUser();
  if (!user) return false;
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) return false;
  const existingLike = await prisma.like.findFirst({
    where: {
      userId: dbUser.id,
      postId,
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    // Like
    await prisma.like.create({
      data: {
        userId: dbUser.id,
        postId,
      },
    });
  }
  return true;
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("Unauthorized - no delete permission");
    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath("/"); // purge the cache
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function getPostById(postId: string) {
  try {
    const res = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                isVerified: true,
              },
            },
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

export async function addComment(
  postId: string,
  dbUserId: string,
  message: string
) {
  try {
    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId: dbUserId,
        content: message,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { success: false };
  }
}

export async function deleteComment(commentID: string) {
  try {
    await prisma.comment.delete({
      where: { id: commentID },
    });
    revalidatePath("/"); // purge the cache
    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
