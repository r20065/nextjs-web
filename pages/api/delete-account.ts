import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") return res.status(405).end();

    const session = await getSession({ req });

    if (!session?.user?.email) {
        return res.status(401).json({ message: "認証が必要です" });
    }

    try {
        await prisma.user.delete({
            where: { email: session.user.email },
        });
        res.status(200).json({ message: "アカウントを削除しました" });
    } catch (error) {
        res.status(500).json({ message: "アカウント削除中にエラーが発生しました" });
    }
}
