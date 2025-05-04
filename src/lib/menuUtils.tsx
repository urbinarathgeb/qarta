// src/lib/menuUtils.ts
import { supabase } from "@/lib/supabaseClient";
import Bebida from "@/assets/Bebida.svg";
import Cerveza from "@/assets/Cerveza.svg";
import Pasta from "@/assets/Pasta.svg";
import Pizza from "@/assets/Pizza.svg";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image_url?: string;
  created_at?: string;
  category?: string;
}

export async function fetchMenuData() {
  // 1. Fetch promos activas
  const { data: promos } = await supabase
    .from("promos")
    .select("*")
    .eq("active", true)
    .order("start_date", { ascending: false });

  // 2. Fetch platos normales
  let { data: dishesData, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("available", true);

  let dishes = (dishesData ?? []) as Dish[];

  // 3. Fetch categorías
  let { data: enumCategory, error: enumError } =
    await supabase.rpc("get_enumcategories_values");

  // Section icon
  const sectionIcon = {
    pizza: Pizza,
    bebida: Bebida,
    cerveza: Cerveza,
    pasta: Pasta,
  } as const;

  // 4. Si hay promos de tipo descuento, filtra esos platos del menú
  let promoDishIds: string[] = [];
  if (promos && promos.length > 0) {
    promoDishIds = promos
      .filter((p) => p.type === "descuento" && p.dish_id)
      .map((p) => p.dish_id);
  }
  dishes = dishes.filter(
    (dish) => !promoDishIds.includes(dish.id)
  );

  // 5. Agrupar platos por categoría
  let dishesByCategory = Object.fromEntries(
    (enumCategory as string[]).map((cat) => [
      cat,
      dishes.filter((dish) => dish.category === cat),
    ])
  );

  return {
    promos,
    dishesByCategory,
    enumCategory,
    error: error || enumError,
    sectionIcon,
  };
}