import express, { Router } from "express";
import * as authController from "./controllers/auth.controller";
import * as homeController from "./controllers/home.controller";
import * as noteController from "./controllers/note.controller";
import * as profileController from "./controllers/profile.controller";
import { notLoginMiddleware } from "./middlewares/not-login.middleware";
import { isLoginMiddleware } from "./middlewares/is-login.middleware";

const router: Router = express.Router();

// Login
router.get("/auth/login", notLoginMiddleware, authController.showLoginPage);
router.post("/auth/login", notLoginMiddleware, authController.login);

// Register
router.get("/auth/register", notLoginMiddleware, authController.showRegisterPage);
router.post("/auth/register", notLoginMiddleware, authController.register);

// Forgot Password
router.get("/auth/forgot-password", notLoginMiddleware, authController.showForgotPasswordPage);
router.post("/auth/forgot-password", notLoginMiddleware, authController.sendLinkResetPassword);

router.get("/auth/logout", authController.logout);

router.get("/", isLoginMiddleware, homeController.showHomePage);

router.get("/profile", isLoginMiddleware, profileController.showProfile);
router.post("/profile/update", isLoginMiddleware, profileController.updateProfile);

router.get("/notes/create", isLoginMiddleware, noteController.showCreatePage);
router.post("/notes", isLoginMiddleware, noteController.createNote);

router.get("/notes/:id", isLoginMiddleware, noteController.showDetailPage);
router.post("/notes/:id/update", isLoginMiddleware, noteController.update);
router.post("/notes/:id/delete", isLoginMiddleware, noteController.deleteNote);

export default router;
