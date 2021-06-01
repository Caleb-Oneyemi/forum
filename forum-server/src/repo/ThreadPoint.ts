import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Auditable } from "./Auditable";
import { Thread } from "./Thread";
import { User } from "./User";

@Entity({ name: "ThreadPoints" })
export class ThreadPoint extends Auditable {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("boolean", { name: "IsDecrement", default: false, nullable: true })
  isDecrement: boolean;

  @ManyToOne(() => User, (user) => user.threadPoints)
  user: User;

  @ManyToOne(() => Thread, (thread) => thread.threadPoints)
  thread: Thread;
}
