import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const showHomePage = async (req: Request, res: Response) => {
    const notes = await prisma.note.findMany({});
    console.log(notes);

    res.render("pages/home-page", {
        layout: "layouts/home-layout",
        title: "Home",
        notes,
    });
};
