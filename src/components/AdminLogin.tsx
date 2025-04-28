import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const ADMIN_EMAIL = "urbinarathgeb@gmail.com";

const AdminLogin: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Solo el email del administrador puede ingresar.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/admin"
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Te enviamos un enlace de acceso a tu correo. Revisa tu bandeja de entrada y spam."
      );
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Acceso Administrador</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          className="border rounded px-3 py-2"
          placeholder="Correo del administrador"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-primary text-white rounded px-4 py-2 font-bold hover:bg-accent transition"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar enlace de acceso"}
        </button>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {message && <div className="text-green-600 text-sm text-center">{message}</div>}
      </form>
    </div>
  );
};

export default AdminLogin;
