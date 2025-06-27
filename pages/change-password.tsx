// pages/change-password.tsx

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import zxcvbn from "zxcvbn";

export default function ChangePassword() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [strengthScore, setStrengthScore] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const result = zxcvbn(newPassword);
        setStrengthScore(result.score);
    }, [newPassword]);

    if (status === "loading") return <p>読み込み中...</p>;
    if (!session) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("新しいパスワードと確認用パスワードが一致しません");
            return;
        }

        if (strengthScore < 3) {
            setError("新しいパスワードの強度が弱すぎます");
            return;
        }

        const res = await fetch("/api/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await res.json();

        if (res.ok) {
            setSuccess("パスワードが変更されました。再ログインしてください。");
            signOut({ callbackUrl: "/login" });
        } else {
            setError(data.message || "パスワード変更に失敗しました");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>パスワード変更</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>現在のパスワード:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>新しいパスワード:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <p>パスワード強度: {["弱い", "やや弱い", "普通", "強い", "非常に強い"][strengthScore]}</p>
                </div>
                <div>
                    <label>新しいパスワード（確認用）:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <button type="submit">変更する</button>
            </form>
        </div>
    );
}
