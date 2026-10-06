import express from "express";
import { createComplaint, getWardenComplaints, resolveComplaint } from "../controller/complaint.controllers.js"
import { authorize,protect } from "../middleware/auth.middlerware.js";
const complaintRouter = express.Router();

complaintRouter.post(
  "/",
  protect,
  authorize("student"),
  createComplaint
);
complaintRouter.get(
  "/warden",
  protect,
  authorize("warden"),
  getWardenComplaints
);

complaintRouter.put(
  "/:id/resolve",
  protect,
  authorize("warden"),
  resolveComplaint
);
export default complaintRouter;