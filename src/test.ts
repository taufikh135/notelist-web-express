import { prisma } from "./lib/prisma";

(async () => {
    const user = await prisma.user.findFirst();

    console.log(user);

    await prisma.note.create({
        data: {
            title: "Note Pertama",
            content: "Ini adalah note pertama saya",
            userId: user?.id || 0,
        },
    });

    await prisma.note.create({
        data: {
            title: "Note Kedua",
            content: "Ini adalah note kedua saya",
            userId: user?.id || 0,
        },
    });

    const notes = await prisma.note.findMany({});

    console.log(notes);
})();
