import { RequestHandler, Router } from "express";
import { GET_OCCUPANCY } from "../controllers/occupancy.controller";
import {
  CREATE_PROPERTY_ROOM_TYPE,
  GET_ROOM_TYPE_BY_ID,
  UPDATE_ROOM_TYPE,
} from "../controllers/room-type.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .get(GET_OCCUPANCY as unknown as RequestHandler<CustomRequest>);

router
  .route("/:roomTypeId")
  .get(GET_ROOM_TYPE_BY_ID as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .post(CREATE_PROPERTY_ROOM_TYPE as unknown as RequestHandler<CustomRequest>);

router
  .route("/:roomTypeId")
  .put(UPDATE_ROOM_TYPE as unknown as RequestHandler<CustomRequest>);

export default router;
