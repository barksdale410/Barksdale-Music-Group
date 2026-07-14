import { Router, type IRouter } from "express";
import healthRouter from "./health";
import musicRouter from "./music";
import generateRouter from "./generate";
import collabRouter from "./collab";
import userRouter from "./user";

const router: IRouter = Router();

router.use(healthRouter);
router.use(musicRouter);
router.use(generateRouter);
router.use(collabRouter);
router.use(userRouter);

export default router;
