import { isThreadBodyValid } from "../common/validators/ThreadValidators";
import { QueryArrayResult, QueryOneResult } from "./QueryArrayResult";
import { ThreadItem } from "./ThreadItem";
import { Thread } from "./Thread";
import { User } from "./User";

export const createThreadItem = async (
  userId: string,
  threadId: string,
  body: string
): Promise<QueryOneResult<ThreadItem>> => {
  const bodyMsg = isThreadBodyValid(body);
  if (bodyMsg) {
    return {
      messages: [bodyMsg],
    };
  }

  if (!userId) {
    return {
      messages: ["User not logged in"],
    };
  }

  const user = await User.findOne({ id: userId });
  const thread = await Thread.findOne({ id: threadId });

  if (!thread) {
    return {
      messages: ["Thread not found"],
    };
  }

  const threadItem = await ThreadItem.create({ user, body, thread }).save();
  if (!threadItem) {
    return {
      messages: ["Failed to create thread item"],
    };
  }

  return {
    messages: [`${threadItem.id}`],
  };
};

export const getThreadItemsByThreadId = async (
  threadId: string
): Promise<QueryArrayResult<ThreadItem>> => {
  const threadItems = await ThreadItem.createQueryBuilder("ti")
    .where(`ti."threadId" = :threadId`, { threadId })
    .leftJoinAndSelect("ti.thread", "thread")
    .orderBy("ti.createdOn", "DESC")
    .getMany();

  if (!threadItems) {
    return {
      messages: ["Thread Items of thread not found"],
    };
  }

  return {
    entities: threadItems,
  };
};
