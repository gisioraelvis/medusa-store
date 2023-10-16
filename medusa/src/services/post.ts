import {
  FindConfig,
  Selector,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import PostRepository from "../repositories/post";
import { Post } from "../models/post";
import { MedusaError } from "@medusajs/utils";

class PostService extends TransactionBaseService {
  protected postRepository_: typeof PostRepository;

  constructor(container) {
    super(container);
    this.postRepository_ = container.postRepository;
  }

  async listAndCount(
    selector?: Selector<Post>,
    config: FindConfig<Post> = {
      skip: 0,
      take: 20,
      relations: [],
    }
  ): Promise<[Post[], number]> {
    const postRepo = this.activeManager_.withRepository(this.postRepository_);

    const query = buildQuery(selector, config);

    return postRepo.findAndCount(query);
  }

  async list(
    selector?: Selector<Post>,
    config: FindConfig<Post> = {
      skip: 0,
      take: 20,
      relations: [],
    }
  ): Promise<Post[]> {
    const [posts] = await this.listAndCount(selector, config);

    return posts;
  }

  async retrieve(id: string, config?: FindConfig<Post>): Promise<Post> {
    const postRepo = this.activeManager_.withRepository(this.postRepository_);

    const query = buildQuery(
      {
        id,
      },
      config
    );

    const post = await postRepo.findOne(query);

    if (!post) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Post was not found");
    }

    return post;
  }

  async create(data: Pick<Post, "title" | "author_id">): Promise<Post> {
    return this.atomicPhase_(async (manager) => {
      const postRepo = manager.withRepository(this.postRepository_);
      const post = postRepo.create();
      post.title = data.title;
      post.author_id = data.author_id;
      const result = await postRepo.save(post);

      return result;
    });
  }

  async update(id: string, data: Omit<Partial<Post>, "id">): Promise<Post> {
    return await this.atomicPhase_(async (manager) => {
      const postRepo = manager.withRepository(this.postRepository_);
      const post = await this.retrieve(id);

      Object.assign(post, data);

      return await postRepo.save(post);
    });
  }

  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const postRepo = manager.withRepository(this.postRepository_);
      const post = await this.retrieve(id);

      await postRepo.remove([post]);
    });
  }
}

export default PostService;
