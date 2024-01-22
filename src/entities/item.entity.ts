import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SourceEnum } from '../enum/SourceEnum';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 256, type: 'varchar', charset: 'utf8mb4' })
    title!: string;

    @Column({ length: 256, nullable: true, charset: 'utf8mb4' })
    subtitle?: string;

    @Column({ length: 2048, charset: 'utf8mb4' })
    description!: string;

    @Column('float')
    price!: number;

    @Column({ length: 2048, charset: 'utf8mb4' })
    specifications!: string;

    @Column({ length: 128 })
    type!: string;

    @Column({ length: 1024 })
    image!: string;

    @Column({
        type: 'enum',
        enum: SourceEnum,
        enumName: 'source_enum',
        default: SourceEnum.ROZETKA,
    })
    source?: SourceEnum;

    @Column()
    storePage!: string;
}
