// pages/login.tsx

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError(res.error);
        } else {
            // ログイン成功時にマイページへ遷移
            window.location.href = "/mypage";
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>ログイン</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>メールアドレス:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>パスワード:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">ログイン</button>
            </form>
        </div>
    );
}
