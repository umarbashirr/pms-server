import { RequestHandler, Router } from "express";
import {
  CREATE_ROOM,
  GET_ALL_ROOMS,
  GET_ROOM_BY_ID,
  UPDATE_ROOM,
} from "../controllers/room.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { VerifyUserAdminAccess } from "../middlewares/verify-admin-access.middleware";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .get(GET_ALL_ROOMS as unknown as RequestHandler<CustomRequest>);

router
  .route("/:roomId")
  .get(GET_ROOM_BY_ID as unknown as RequestHandler<CustomRequest>);

router.use(VerifyUserAdminAccess as unknown as RequestHandler<CustomRequest>);

router.route("/").post(CREATE_ROOM as unknown as RequestHandler<CustomRequest>);

router
  .route("/:roomId")
  .put(UPDATE_ROOM as unknown as RequestHandler<CustomRequest>);

export default router;
