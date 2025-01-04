import { RequestHandler, Router } from "express";
import {
  CREATE_PROPERTY_ROOM_TYPE,
  GET_ALL_ROOM_TYPES,
  GET_ROOM_TYPE_BY_ID,
  UPDATE_ROOM_TYPE,
} from "../controllers/room-type.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { VerifyUserAdminAccess } from "../middlewares/verify-admin-access.middleware";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .get(GET_ALL_ROOM_TYPES as unknown as RequestHandler<CustomRequest>);

router
  .route("/:roomTypeId")
  .get(GET_ROOM_TYPE_BY_ID as unknown as RequestHandler<CustomRequest>);

router.use(VerifyUserAdminAccess as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .post(CREATE_PROPERTY_ROOM_TYPE as unknown as RequestHandler<CustomRequest>);

router
  .route("/:roomTypeId")
  .put(UPDATE_ROOM_TYPE as unknown as RequestHandler<CustomRequest>);

export default router;
