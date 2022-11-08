import { Router } from "express";
import { getUserPermissionsHandler } from "./get-user-permissions";
import { passwordResetHandler } from "./reset-password";
import { updateProfileHandler } from "./update-profile.handler";
import { verifyEmailHandler } from "./verify-email";

const usersRouter = Router();

usersRouter.put("/update-profile", updateProfileHandler);
usersRouter.post("/verify-email", verifyEmailHandler);
usersRouter.post("/reset-password", passwordResetHandler);
usersRouter.get("/permissions", getUserPermissionsHandler);

export default usersRouter;
