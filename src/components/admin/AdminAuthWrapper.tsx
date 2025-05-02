import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "urbinarathgeb@gmail.com";

type Props = {
  children: ReactNode;
};

const AdminAuthWrapper: React.FC<Props> = ({
  children,
}) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10">Cargando...</div>
    );
  if (!session || session.user.email !== ADMIN_EMAIL) {
    return <AdminLogin />;
  }
  return <>{children}</>;
};

export default AdminAuthWrapper;
