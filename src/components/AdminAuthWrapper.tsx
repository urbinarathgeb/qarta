import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AdminLogin from "./AdminLogin";
import { supabase } from "../supabaseClient";

const ADMIN_EMAIL = "urbinarathgeb@gmail.com";

type Props = {
  children: ReactNode;
};

const AdminAuthWrapper: React.FC<Props> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!session || session.user.email !== ADMIN_EMAIL) {
    return <AdminLogin />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
      {children}
    </>
  );
};

export default AdminAuthWrapper;
