import express from "express";
import { getBanksHandler, connectHandler, getAccountListHandler, getConnectionsHandler } from "./goCardLess.controller";

const router = express.Router();

router.get("/", getBanksHandler);
router.post("/connect", connectHandler);
router.get("/accounts/:id", getAccountListHandler);
router.get("/accounts/:id/list", getAccountListHandler);
router.get("/connections", getConnectionsHandler);

export default router;