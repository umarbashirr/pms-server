import { RequestHandler, Router } from "express";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import {
  AddUserToProperty,
  CREATE_NEW_PROPERTY,
  GET_ALL_PROPERTIES,
  GET_PROPERTY_DETAILS_BY_USER_ID,
  GetUsersByProperty,
  UPDATE_USER_PROPERTY,
} from "../controllers/properties.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";
import { VerifyUserAdminAccess } from "../middlewares/verify-admin-access.middleware";

const router = Router();

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .post(CREATE_NEW_PROPERTY as unknown as RequestHandler<CustomRequest>)
  .get(GET_ALL_PROPERTIES as unknown as RequestHandler<CustomRequest>);

router
  .route("/:propertyId")
  .get(
    GET_PROPERTY_DETAILS_BY_USER_ID as unknown as RequestHandler<CustomRequest>
  )
  .put(UPDATE_USER_PROPERTY as unknown as RequestHandler<CustomRequest>);

router.use(VerifyUserAdminAccess as unknown as RequestHandler<CustomRequest>);

router.post(
  "/:propertyId/users",
  AddUserToProperty as unknown as RequestHandler<CustomRequest>
);
router.get(
  "/:propertyId/users",
  GetUsersByProperty as unknown as RequestHandler<CustomRequest>
);

export default router;
