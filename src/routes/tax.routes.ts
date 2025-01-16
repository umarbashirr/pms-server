import { RequestHandler, Router } from "express";
import {
  CreateNewTax,
  GetAllTaxes,
  UpdateTax,
} from "../controllers/tax.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { VerifyUserAdminAccess } from "../middlewares/verify-admin-access.middleware";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router.route("/").get(GetAllTaxes as unknown as RequestHandler<CustomRequest>);

// Check for admin rights as well
router.use(VerifyUserAdminAccess as unknown as RequestHandler<CustomRequest>);

router
  .route("/:taxId")
  .put(UpdateTax as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .post(CreateNewTax as unknown as RequestHandler<CustomRequest>);

export default router;
