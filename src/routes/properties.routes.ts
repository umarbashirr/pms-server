import { RequestHandler, Router } from "express";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import {
  CREATE_NEW_PROPERTY,
  GET_ALL_PROPERTIES,
  GET_PROPERTY_DETAILS_BY_USER_ID,
} from "../controllers/properties.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";

const router = Router();

router.use(verifyAccessToken);

router
  .route("")
  .post(CREATE_NEW_PROPERTY as unknown as RequestHandler<CustomRequest>)
  .get(GET_ALL_PROPERTIES as unknown as RequestHandler<CustomRequest>);

router
  .route("/:propertyId")
  .get(
    GET_PROPERTY_DETAILS_BY_USER_ID as unknown as RequestHandler<CustomRequest>
  );

export default router;
