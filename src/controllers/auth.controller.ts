import { Request, Response } from "express";
import { z } from "zod";
import { getErrorsFromZod } from "../lib/validation";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const showLoginPage = (req: Request, res: Response) => {
    res.render("pages/login-page", {
        layout: "layouts/auth-layout",
        title: "Login",
    });
};

export const login = async (req: Request, res: Response) => {
    const schema = z.object({
        email: z.email({ message: "Email tidak valid" }),
        password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = getErrorsFromZod(result);

        req.flash("error", errorMessages.join(", ") || "Input tidak valid");
        req.flash("email", req.body.email);

        return res.redirect("/auth/login");
    }

    const { email, password } = result.data;
    const remember = req.body.remember === "on";

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        req.flash("error", "Email atau password salah");
        req.flash("email", email);

        return res.redirect("/auth/login");
    }

    if (!(await bcrypt.compare(password, user.password))) {
        req.flash("error", "Email atau password salah");
        req.flash("email", email);

        return res.redirect("/auth/login");
    }
    req.session.user = user;

    if (remember) {
        const rememberToken = crypto.randomBytes(32).toString("hex");

        // simpan rememberToken di cookie
        res.cookie("remember", rememberToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
        });

        // simpan rememberToken di database
        prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                rememberToken: rememberToken,
            },
        });
    } else {
        req.session.cookie.expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Session cookie
    }

    req.flash("success", "Login berhasil");

    res.redirect("/");
};

export const showRegisterPage = (req: Request, res: Response) => {
    res.render("pages/register-page", {
        layout: "layouts/auth-layout",
        title: "Register",
    });
};

export const register = async (req: Request, res: Response) => {
    const schema = z
        .object({
            name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
            email: z.email({ message: "Email tidak valid" }),
            password: z.string().min(6, { message: "Password minimal 6 karakter" }),
            confirmPassword: z.string().min(6, { message: "Konfirmasi password minimal 6 karakter" }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ["confirmPassword"],
            message: "Konfirmasi password tidak sama",
        });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = getErrorsFromZod(result);
        req.flash("error", errorMessages.join(", ") || "Input tidak valid");
        req.flash("name", req.body.name);
        req.flash("email", req.body.email);

        return res.redirect("/auth/register");
    }

    const { name, email, password } = result.data;

    await prisma.user.create({
        data: {
            name,
            email,
            password: await bcrypt.hash(password, 10),
        },
    });

    req.flash("success", "Registrasi berhasil");

    res.redirect("/auth/login");
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error saat logout:", err);
            req.flash("error", "Terjadi kesalahan saat logout");
            return res.redirect("/");
        }
        res.clearCookie("connect.sid");
        req.flash("success", "Logout berhasil");
        res.redirect("/auth/login");
    });
};

export const showForgotPasswordPage = (req: Request, res: Response) => {
    res.render("pages/forgot-password-page", {
        layout: "layouts/auth-layout",
        title: "Forgot Password",
    });
};

export const sendLinkResetPassword = async (req: Request, res: Response) => {
    const schema = z.object({
        email: z.email({ message: "Email tidak valid" }),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = getErrorsFromZod(result);
        req.flash("error", errorMessages.join(", ") || "Input tidak valid");
        req.flash("email", req.body.email);

        return res.redirect("/auth/forgot-password");
    }

    const { email } = result.data;

    // Belum selesai
};
