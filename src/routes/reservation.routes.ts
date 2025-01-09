import { RequestHandler, Router } from "express";
import {
  CREATE_RESERVATION,
  GET_RESERVATION_BY_ID,
} from "../controllers/reservation.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .post(CREATE_RESERVATION as unknown as RequestHandler<CustomRequest>);

router
  .route("/:reservationId")
  .get(GET_RESERVATION_BY_ID as unknown as RequestHandler<CustomRequest>);

export default router;
