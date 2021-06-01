import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Auditable } from './Auditable';
import { Thread } from './Thread';


@Entity({ name: 'ThreadCategories' })
export class ThreadCategory extends Auditable {
    @PrimaryGeneratedColumn({ name: 'Id', type: 'bigint' })
    id: string;

    @Column('varchar', {
        name: 'Name',
        length: 100,
        unique: true,
        nullable: false
    })
    name: string;

    @Column('varchar', {
        name: 'Description',
        length: 150,
        nullable: true
    })
    description: string;

    @OneToMany(() => Thread, (thread) => thread.category)
    threads: Thread[];
}