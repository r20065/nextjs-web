// components/Header.tsx
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();

    return (
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "2rem" }}>
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <Link href="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        MyApp
                    </Link>
                </div>

                <div>
                    {status === "loading" ? (
                        <span>読み込み中...</span>
                    ) : session ? (
                        <>
                            <span style={{ marginRight: "1rem" }}>
                                ログイン中: {session.user?.email ?? "ユーザー"}
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                style={{ cursor: "pointer" }}
                            >
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" style={{ marginRight: "1rem" }}>
                                ログイン
                            </Link>
                            <Link href="/signup">
                                サインアップ
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
