"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redireciona automaticamente se usuário já estiver logado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/"); // redireciona para o calendário
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push("/");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) setError(error.message);
    else router.push("/"); // redireciona após login bem-sucedido
  };

  // SIGNUP
  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    setError("");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Cria perfil na tabela "profiles"
    if (signUpData.user?.id) {
      const { error: profileError } = await supabase.from("profiles").insert([
        { id: signUpData.user.id, email: signUpData.user.email },
      ]);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    alert("Cadastro realizado! Confirme seu e-mail antes de logar.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 px-4 py-2 w-full max-w-xs border rounded"
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 px-4 py-2 w-full max-w-xs border rounded"
        disabled={loading}
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 mt-2 w-full max-w-xs">
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Carregando..." : "Entrar"}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Carregando..." : "Cadastrar"}
        </button>
      </div>
    </div>
  );
}
