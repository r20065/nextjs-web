import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ログインチェック
    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") return <p>読み込み中...</p>;
    if (!session) return null;

    const handleDeleteAccount = async () => {
        if (!confirm("本当にアカウントを削除しますか？ この操作は戻せません。")) return;

        setLoading(true);
        setError("");

        const res = await fetch("/api/delete-account", {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            alert("アカウントを削除しました。ログアウトします。");
            signOut({ callbackUrl: "/signup" });
        } else {
            const data = await res.json();
            setError(data.message || "アカウント削除に失敗しました");
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>マイページ</h1>
            <p>こんにちは、{session.user?.email}さん</p>

            <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ marginRight: "1rem" }}>
                ログアウト
            </button>

            <button onClick={() => router.push("/change-password")} style={{ marginRight: "1rem" }}>
                パスワード変更
            </button>

            <button onClick={handleDeleteAccount} disabled={loading} style={{ backgroundColor: "red", color: "white" }}>
                アカウント削除
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
