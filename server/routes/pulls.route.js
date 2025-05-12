import { Router } from "express";
import { pullDetails, verifyPull } from "../controllers/pull.controller.js";

const router = Router();

router.route("/").get((req, res) => {
	res.send(
		"Pulls route \n /verify to verify pull request \n /details to get pull request details"
	);
});
router.route("/verify").post(verifyPull);
router.route("/details/:id").get(pullDetails);

export default router;
