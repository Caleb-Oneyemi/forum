import { getManager } from "typeorm";
import { ThreadItem } from "./ThreadItem";
import { ThreadItemPoint } from "./ThreadItemPoint";
import { User } from "./User";

export const updateThreadItemPoint = async (
  userId: string,
  threadItemId: string,
  increment: boolean
): Promise<string> => {
  if (!userId || userId === "0") {
      return "User is not authenticated";
  }

  let message = "Failed to increment thread item point";
  const threadItem = await ThreadItem.findOne({
    where: { id: threadItemId },
    relations: ["user"],
  });

  if (threadItem!.user!.id === userId) {
    message = "Error: users cannot increment their own thread item";
    return message;
  }

  const user = await User.findOne({ where: { id: userId } });

  const existingPoint = await ThreadItemPoint.findOne({
    where: {
      threadItem: { id: threadItemId },
      user: { id: userId },
    },
    relations: ["threadItem"],
  });

  await getManager().transaction(async (transactionEntityManager) => {
    if (existingPoint) {
      if (increment) {
        if (existingPoint.isDecrement) {
          await ThreadItemPoint.remove(existingPoint);
          threadItem!.points = Number(threadItem!.points) + 1;
          threadItem!.lastModifiedOn = new Date();
          await threadItem!.save();
        }
      } else {
        if (!existingPoint.isDecrement) {
          await ThreadItemPoint.remove(existingPoint);
          threadItem!.points = Number(threadItem!.points) - 1;
          threadItem!.lastModifiedOn = new Date();
          await threadItem!.save();
        }
      }
    } else {
      await ThreadItemPoint.create({
        threadItem,
        isDecrement: !increment,
        user,
      }).save();

      if (increment) {
        threadItem!.points = Number(threadItem!.points) + 1;
      } else {
        threadItem!.points = Number(threadItem!.points) - 1;
      }
      threadItem!.lastModifiedOn = new Date();
      await threadItem!.save();
    }
    message = `Successfully ${
      increment ? "incremented" : "decremented"
    } point.`;
  });

  return message;
};
