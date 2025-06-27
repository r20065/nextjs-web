// pages/signup.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import zxcvbn from "zxcvbn";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strengthScore, setStrengthScore] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const result = zxcvbn(password);
    setStrengthScore(result.score);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("パスワードと確認用パスワードが一致しません");
      return;
    }

    if (strengthScore < 3) {
      setError("パスワードの強度が弱すぎます");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "登録に失敗しました");
      return;
    }

    // 登録成功後、自動ログインしてmypageへ遷移
    const signInResult = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.error) {
      setError("登録しましたが自動ログインに失敗しました。手動でログインしてください。");
    } else {
      router.push("/mypage");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>サインアップ</h1>
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
          <p>パスワード強度: {["弱い", "やや弱い", "普通", "強い", "非常に強い"][strengthScore]}</p>
        </div>
        <div>
          <label>パスワード（確認用）:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">登録する</button>
      </form>
    </div>
  );
}
