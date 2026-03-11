import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const showProfile = (req: Request, res: Response) => {
    const user = req.session.user;

    res.render("pages/profile-page", {
        title: "Profile",
        layout: "layouts/home-layout",
        user,
    });
};

export const updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const user = req.session.user;

    const userUpdated = await prisma.user.update({
        where: {
            id: Number(user?.id),
        },
        data: {
            name,
            email,
        },
    });

    req.session.user = userUpdated;

    req.flash("success", "Profile updated successfully");
    res.redirect("/profile");
};
