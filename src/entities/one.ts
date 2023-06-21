import { Entity, Column } from "typeorm";

@Entity()
export class NewDbEntity {

  @Column()
  name!: string;

}