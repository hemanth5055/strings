"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
  if (!user) return;
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) return;
  await prisma.post.create({
    data: {
      content,
      image: image || null,
      authorId: dbUser.id,
    },
  });
  revalidatePath("/");
}

export async function toggleLike(postId: string) {
  const user = await currentUser();
  if (!user) return;
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) return;
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
}
