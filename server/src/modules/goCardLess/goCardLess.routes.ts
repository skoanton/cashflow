import express from "express";
import { getBanksController, connectToBankController, getAccountListController, getConnectionsController,confirmAccountsController } from "./goCardLess.controller";

const router = express.Router();

router.get("/", getBanksController);
router.post("/connect", connectToBankController);
router.get("/accounts/:id/list", getAccountListController);
router.get("/accounts/:institution_id/confirm", confirmAccountsController);
router.get("/connections", getConnectionsController);

export default router;