import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Author } from "./author";

@Entity()
export class Post extends BaseEntity {
  @Column({ type: "varchar" })
  title: string | null;

  @Column({ type: "varchar" })
  author_id: string;

  @ManyToOne(() => Author, (author) => author.posts)
  @JoinColumn({ name: "author_id" })
  author: Author;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "post");
  }
}
