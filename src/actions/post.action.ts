"use server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

// ✅ Get All Posts
export async function getAllPosts() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isVerified: true,
            createdAt: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
        likes: true,
        comments: true,
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error("getAllPosts error:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

// ✅ Get All Posts of a User
export async function getAllPostsOfuser(userId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
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
          select: { likes: true, comments: true },
        },
        likes: true,
        comments: true,
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error("getAllPostsOfuser error:", error);
    return { success: false, error: "Failed to fetch user's posts" };
  }
}

// ✅ Add Post
export async function addPost(content: string, image?: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) throw new Error("User not found in DB");

    await prisma.post.create({
      data: {
        content,
        image: image || null,
        authorId: dbUser.id,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("addPost error:", error);
    return { success: false, error: "Failed to create post" };
  }
}

// ✅ Toggle Like
export async function toggleLike(postId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) throw new Error("User not found");

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: dbUser.id,
        postId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({
        data: { userId: dbUser.id, postId },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("toggleLike error:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

// ✅ Delete Post
export async function deletePost(postId: string) {
  try {
    const { userId } = await getDbUserId();
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Unauthorized");

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("deletePost error:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

// ✅ Get Post By ID
export async function getPostById(postId: string) {
  try {
    const res = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isVerified: true,
            createdAt: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
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
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return { success: true, data: res };
  } catch (error) {
    console.error("getPostById error:", error);
    return { success: false, error: "Failed to get post" };
  }
}

// ✅ Add Comment
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
    return { success: true, data: newComment };
  } catch (error) {
    console.error("addComment error:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

// ✅ Delete Comment
export async function deleteComment(commentID: string) {
  try {
    await prisma.comment.delete({
      where: { id: commentID },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("deleteComment error:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
