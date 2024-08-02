import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {});
router.get("/", async (req, res) => {
  res.send({ status_code: 200, msg: "get car" });
});
router.patch("/", async (req, res) => {});
router.delete("/", async (req, res) => {});

export default router;
