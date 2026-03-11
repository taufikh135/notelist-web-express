import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import z from "zod";
import { getErrorsFromZod } from "../lib/validation";

export const showDetailPage = async (req: Request, res: Response) => {
    const noteId = req.params.id;

    const note = await prisma.note.findUnique({
        where: {
            id: Number(noteId),
        },
    });

    res.render("pages/note-detail-page", {
        layout: "layouts/home-layout",
        title: note?.title || "Note Detail",
        note,
    });
};

export const showCreatePage = (req: Request, res: Response) => {
    res.render("pages/note-create-page", {
        layout: "layouts/home-layout",
        title: "Create Note",
    });
};

export const createNote = async (req: Request, res: Response) => {
    const schema = z.object({
        title: z.string().min(1, { message: "Title tidak boleh kosong" }),
        content: z.string().min(1, { message: "Content tidak boleh kosong" }),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = getErrorsFromZod(result);
        req.flash("error", errorMessages.join(", ") || "Input tidak valid");
        req.flash("title", req.body.title);
        req.flash("content", req.body.content);
        return res.redirect("/notes/create");
    }

    const userId = req.session.user?.id || 0;

    await prisma.note.create({
        data: {
            title: result.data.title,
            content: result.data.content,
            userId,
        },
    });

    req.flash("success", "Note berhasil dibuat");
    res.redirect("/");
};

export const deleteNote = async (req: Request, res: Response) => {
    const noteId = req.params.id;

    await prisma.note.delete({
        where: {
            id: Number(noteId),
        },
    });

    req.flash("success", "Note berhasil dihapus");
    res.redirect("/");
};

export const update = async (req: Request, res: Response) => {
    const schema = z.object({
        title: z.string().min(1, { message: "Title tidak boleh kosong" }),
        content: z.string().min(1, { message: "Content tidak boleh kosong" }),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = getErrorsFromZod(result);
        req.flash("error", errorMessages.join(", ") || "Input tidak valid");

        return res.redirect(`/notes/${req.params.id}`);
    }

    await prisma.note.update({
        where: {
            id: Number(req.params.id),
        },
        data: {
            title: result.data.title,
            content: result.data.content,
            updatedAt: new Date(),
        },
    });

    req.flash("success", "Note berhasil diperbarui");
    res.redirect(`/notes/${req.params.id}`);
};
