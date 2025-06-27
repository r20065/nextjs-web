// pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // これが使えるようになりました！

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "メールとパスワードは必須です" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ message: "このメールアドレスはすでに登録されています" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    res.status(200).json({ message: "ユーザー登録に成功しました！" });
}
