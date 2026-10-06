import express from "express";
import { createNotice, getMyNotices, getWardenNotices } from "../controller/notice.controller.js";
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


export default noticeRouter;