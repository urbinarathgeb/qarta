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
  const { data: dishesData, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("available", true);

  let dishes = (dishesData ?? []) as Dish[];

  // 3. Fetch categorías
  const { data: enumCategory, error: enumError } =
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
  const dishesByCategory = Object.fromEntries(
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

export async function getCategorizedDishes() {
  try {
    // Comprobamos si ya tenemos los platos en localStorage
    const storedDishes = localStorage.getItem('dishes');
    if (storedDishes) {
      const parsedDishes = JSON.parse(storedDishes);
      return {
        categorizedDishes: parsedDishes,
        error: null,
      };
    }

    // Sino, hacemos la petición
    const { data: dishesData, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('available', true)
      .order('category');

    if (error) {
      console.error('Error fetching dishes:', error.message);
      return { categorizedDishes: {}, error: error.message };
    }

    const { data: enumCategory, error: enumError } = await supabase
      .rpc('get_available_categories');

    if (enumError) {
      console.error('Error fetching categories:', enumError.message);
      return { categorizedDishes: {}, error: enumError.message };
    }

    // ... existing code ...

    // Agrupar los platos por categoría
    const dishesByCategory = {};

    // ... rest of the code ...
  } catch (error) {
    console.error('Error getting categorized dishes:', error.message);
    return { categorizedDishes: {}, error: error.message };
  }
}