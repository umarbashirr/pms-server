import { RequestHandler, Router } from "express";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { CREATE_NEW_PROPERTY } from "../controllers/properties.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";

const router = Router();

router.use(verifyAccessToken);

router
  .route("/create")
  .post(CREATE_NEW_PROPERTY as unknown as RequestHandler<CustomRequest>);

export default router;
