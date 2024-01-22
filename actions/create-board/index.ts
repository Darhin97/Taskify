// server actions [API]

"use server";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { InputType, ReturnType } from "@/actions/create-board/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "@/actions/create-board/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;
  console.log("board creation", title, image);

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  // console.log({
  //   imageId,
  //   imageThumbUrl,
  //   imageFullUrl,
  //   imageLinkHTML,
  //   imageUserName,
  // });

  if (
    !imageId ||
    !imageFullUrl ||
    !imageThumbUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "Missing fields. Failed to create board.",
    };
  }

  if (!title || !image) {
    return {
      error: "Missing field. Failed to create board",
    };
  }

  let board;
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
