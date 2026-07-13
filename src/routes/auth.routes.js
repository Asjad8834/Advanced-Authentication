import { Router } from "express";

import * as authController from "../controllers/auth.controller.js"

const authRouter = Router();


/**
 *   Register a User
 * - POST--> api/auth/register
 */

authRouter.post("/register", authController.registerUser);


authRouter.post("/login", authController.login);


authRouter.get("/get-me", authController.getMe);


/**
 * GET /api/auth/refresh-token
 */
authRouter.get("/refresh-token", authController.refreshToken);


/**
 * GET /api/auth/logout
 */
authRouter.get("/logout", authController.logout);

//Logout all devices

authRouter.get("/logout-all", authController.logoutAll);


export default authRouter;