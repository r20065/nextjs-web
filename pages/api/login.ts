import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "メールとパスワードは必須です" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "ユーザーが見つかりません" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: "パスワードが違います" });
    }

    // ここでセッションはまだ作成していません
    res.status(200).json({ message: "ログイン成功" });
}
