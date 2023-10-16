import { Router } from "express";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import cors from "cors";
import { authenticate, wrapHandler } from "@medusajs/medusa";
import PostService from "src/services/post";
import AuthorService from "src/services/author";

export default function customAdminRoutes(
  router: Router,
  options: ConfigModule
) {
  const { projectConfig } = options;

  const corsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };

  const adminRouter = Router();

  router.use("/admin/blog", adminRouter);

  adminRouter.use(cors(corsOptions));
  adminRouter.use(authenticate());

  // it's recommended to define the routes
  // in separate files. They're done in
  // the same file here for simplicity

  // list all blog posts
  adminRouter.get(
    "/posts",
    wrapHandler(async (req, res) => {
      const postService: PostService = req.scope.resolve("postService");

      res.json({
        posts: await postService.list(),
      });
    })
  );

  // retrieve a single blog post
  adminRouter.get(
    "/posts/:id",
    wrapHandler(async (req, res) => {
      const postService: PostService = req.scope.resolve("postService");

      const post = await postService.retrieve(req.params.id);

      res.json({
        post,
      });
    })
  );

  // create a blog post
  adminRouter.post(
    "/posts",
    wrapHandler(async (req, res) => {
      const postService: PostService = req.scope.resolve("postService");

      // basic validation of request body
      if (!req.body.title || !req.body.author_id) {
        throw new Error("`title` and `author_id` are required.");
      }

      const post = await postService.create(req.body);

      res.json({
        post,
      });
    })
  );

  // update a blog post
  adminRouter.post(
    "/posts/:id",
    wrapHandler(async (req, res) => {
      const postService: PostService = req.scope.resolve("postService");

      // basic validation of request body
      if (req.body.id) {
        throw new Error("Can't update post ID");
      }

      const post = await postService.update(req.params.id, req.body);

      res.json({
        post,
      });
    })
  );

  // delete a blog post
  adminRouter.delete(
    "/posts/:id",
    wrapHandler(async (req, res) => {
      const postService: PostService = req.scope.resolve("postService");

      await postService.delete(req.params.id);

      res.status(200).end();
    })
  );

  // list all blog authors
  adminRouter.get(
    "/authors",
    wrapHandler(async (req, res) => {
      const authorService: AuthorService = req.scope.resolve("authorService");

      res.json({
        authors: await authorService.list(),
      });
    })
  );

  // retrieve a single blog author
  adminRouter.get(
    "/authors/:id",
    wrapHandler(async (req, res) => {
      const authorService: AuthorService = req.scope.resolve("authorService");

      res.json({
        post: await authorService.retrieve(req.params.id),
      });
    })
  );

  // create a blog author
  adminRouter.post(
    "/authors",
    wrapHandler(async (req, res) => {
      const authorService: AuthorService = req.scope.resolve("authorService");

      // basic validation of request body
      if (!req.body.name) {
        throw new Error("`name` is required.");
      }

      const author = await authorService.create(req.body);

      res.json({
        author,
      });
    })
  );

  // update a blog author
  adminRouter.post(
    "/authors/:id",
    wrapHandler(async (req, res) => {
      const authorService: AuthorService = req.scope.resolve("authorService");

      // basic validation of request body
      if (req.body.id) {
        throw new Error("Can't update author ID");
      }

      const author = await authorService.update(req.params.id, req.body);

      res.json({
        author,
      });
    })
  );

  // delete a blog author
  adminRouter.delete(
    "/authors/:id",
    wrapHandler(async (req, res) => {
      const authorService: AuthorService = req.scope.resolve("authorService");

      await authorService.delete(req.params.id);

      res.status(200).end();
    })
  );
}
