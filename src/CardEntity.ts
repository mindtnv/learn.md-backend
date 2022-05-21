import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CardEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  interval: number;
  @Column()
  stage: number;
  @Column()
  learnDate: Date;
  @Column()
  createDate: Date;
  @Column()
  pasteId: string;
  @Column()
  pasteEditCode: string;
  @Column()
  deck: string;
}
