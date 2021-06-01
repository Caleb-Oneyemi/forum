import Thread from "./Thread";
import ThreadItem from "./ThreadItem";

export default class User {
  constructor(
    public id: string,
    public email: string,
    public Username: string,
    public threads?: Array<Thread>,
    public threadItems?: Array<ThreadItem>
  ) {}
}
