import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auditable } from './Auditable';
import { ThreadItem } from './ThreadItem';
import { User } from './User';


@Entity({ name: 'ThreadItemPoints' })
export class ThreadItemPoint extends Auditable {
    @PrimaryGeneratedColumn({ name: 'Id', type: 'bigint' })
    id: string;

    @Column('boolean', { name: 'IsDecrement', default: false })
    isDecrement: boolean;

    @ManyToOne(() => User, (user) => user.threadPoints)
    user: User;

    @ManyToOne(() => ThreadItem, (threadItem) => threadItem.threadItemPoints)
    threadItem: ThreadItem
}