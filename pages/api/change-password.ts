import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const session = await getSession({ req });

    if (!session?.user?.email) {
        return res.status(401).json({ message: "認証が必要です" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "必要な情報が不足しています" });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: "現在のパスワードが違います" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email: session.user.email },
        data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "パスワード変更成功" });
}
