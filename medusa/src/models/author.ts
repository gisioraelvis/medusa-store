import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { Post } from "./post";

@Entity()
export class Author extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  image?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "auth");
  }
}
