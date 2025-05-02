import React from 'react'
import { supabase } from "@/lib/supabaseClient";

const LogoutButton = () => {

    //   async function handleLogout() {
    //     await supabase.auth.signOut();
    //     window.location.reload();
    //   }
  return (
    <button
      onClick={() => supabase.auth.signOut()}
      className="text-white transition absolute bottom-4 right-8 hover:cursor-pointer hover:scale-105 hover:font-bold hover:underline duration-150"
    >
      Cerrar sesión
    </button>
  )
}

export default LogoutButton