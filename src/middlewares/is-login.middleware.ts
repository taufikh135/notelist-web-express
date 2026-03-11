import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const isLoginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // ambil rememberToken dari cookie
    const rememberToken = req.cookies.remember;

    if (rememberToken && !req.session.user) {
        // cari user dengan rememberToken
        const user = await prisma.user.findFirst({
            where: {
                rememberToken: rememberToken,
            },
        });

        if (user) {
            req.session.user = user;
        } else {
            // hapus cookie remember jika token tidak valid
            res.clearCookie("remember");
        }
    }

    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    next();
};
