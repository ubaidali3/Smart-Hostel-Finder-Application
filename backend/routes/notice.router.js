import express from "express";
import { createNotice, deleteNotice, getMyNotices, getWardenNotices } from "../controller/notice.controller.js";
import { authorize,protect } from "../middleware/auth.middlerware.js";


const noticeRouter = express.Router();

noticeRouter.post('/',protect,authorize('warden'),createNotice)
noticeRouter.get('/my',protect,authorize('student'),getMyNotices)
noticeRouter.get(
  '/warden',
  protect,
  authorize('warden'),
  getWardenNotices
);
noticeRouter.delete(
  "/:id",
  protect,
  authorize("warden"),
  deleteNotice
);

export default noticeRouter;