import { RequestHandler, Router } from "express";
import {
  CREATE_COMPANY_PROFILE,
  CREATE_INDIVIDUAL_PROFILE,
  GET_COMPANY_PROFILE,
  GET_INDIVIDUAL_PROFILE,
  UPDATE_COMPANY_PROFILE,
  UPDATE_INDIVIDUAL_PROFILE,
} from "../controllers/profile.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

// Individual
router
  .route("/individual")
  .get(GET_INDIVIDUAL_PROFILE as unknown as RequestHandler<CustomRequest>);

router
  .route("/individual")
  .post(CREATE_INDIVIDUAL_PROFILE as unknown as RequestHandler<CustomRequest>);

router
  .route("/individual/:profileId")
  .put(UPDATE_INDIVIDUAL_PROFILE as unknown as RequestHandler<CustomRequest>);

//   Company

router
  .route("/company")
  .get(GET_COMPANY_PROFILE as unknown as RequestHandler<CustomRequest>);

router
  .route("/company")
  .post(CREATE_COMPANY_PROFILE as unknown as RequestHandler<CustomRequest>);

router
  .route("/company/:profileId")
  .put(UPDATE_COMPANY_PROFILE as unknown as RequestHandler<CustomRequest>);

export default router;
