import { Router } from "express";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import PostService from "src/services/post";
import AuthorService from "src/services/author";

export default function customStoreRoutes(
  router: Router,
  options: ConfigModule
) {
  const { projectConfig } = options;

  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const storeRouter = Router();
  router.use("/store/blog", storeRouter);

  storeRouter.use(cors(storeCorsOptions));

  // list all blog posts
  storeRouter.get(
    "/posts",
    wrapHandler(async (req, res) => {
      const postService: PostService = req.scope.resolve("postService");

      res.json({
        posts: await postService.list(),
      });
    })
  );

  // retrieve a single blog post
  storeRouter.get(
    "/posts/:id",
    wrapHandler(async (req, res) => {
      const postService: PostService = req.scope.resolve("postService");

      res.json({
        post: await postService.retrieve(req.params.id),
      });
    })
  );

  // list all blog authors
  storeRouter.get(
    "/authors",
    wrapHandler(async (req, res) => {
      const authorService: AuthorService = req.scope.resolve("authorService");

      res.json({
        authors: await authorService.list(),
      });
    })
  );

  // retrieve a single blog author
  storeRouter.get(
    "/authors/:id",
    wrapHandler(async (req, res) => {
      const authorService: AuthorService = req.scope.resolve("authorService");

      res.json({
        post: await authorService.retrieve(req.params.id),
      });
    })
  );
}
