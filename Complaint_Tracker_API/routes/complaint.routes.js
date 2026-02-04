import express from "express";
const app = express();
import {
    getAllComplaints,
    createComplaint,
    resolveComplaint,
    deleteComplaint
} from "../controllers/complaint.controller.js";

import auth from "../middleware/auth.middleware.js";
const router = express.Router();

// Public routes
router.get("/", getAllComplaints);
router.post("/", createComplaint);

// Protected routes
router.put("/:id/resolve", auth, resolveComplaint);
router.delete("/:id", auth, deleteComplaint);
export default router;
