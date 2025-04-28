import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export type FilterType = 'all' | 'active' | 'inactive';

export interface UseCrudListOptions<T> {
  table: string;
  defaultFilter?: FilterType;
  mapItem?: (item: any) => T;
  defaultItem?: Partial<T>;
  activeField?: string; // 'active', 'available', etc.
}

export function useCrudList<T = any>({
  table,
  defaultFilter = 'all',
  mapItem,
  defaultItem = {},
  activeField = 'active',
}: UseCrudListOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  async function fetchItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setItems(mapItem ? data.map(mapItem) : data || []);
    } catch (err) {
      setError("Error inesperado al obtener datos");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  function handleNew() {
    setEditingItem(null);
    setShowForm(true);
  }

  function handleEdit(item: T) {
    setEditingItem(item);
    setShowForm(true);
  }

  function handleCancelForm() {
    setEditingItem(null);
    setShowForm(false);
  }

  async function handleSave(itemData: Partial<T>) {
    setLoading(true);
    setError(null);
    const isEdit = editingItem && (editingItem as any).id;
    const dataToSave = isEdit ? { ...(editingItem as any), ...itemData } : itemData;
    if (!isEdit && dataToSave[activeField] === undefined) dataToSave[activeField] = true;
    if (typeof dataToSave.price === 'string') dataToSave.price = Number(dataToSave.price);
    try {
      let error;
      if (isEdit) {
        ({ error } = await supabase.from(table).update(dataToSave).eq("id", (editingItem as any).id));
      } else {
        ({ error } = await supabase.from(table).insert([dataToSave]));
      }
      if (error) setError(error.message);
      else {
        await fetchItems();
        setShowForm(false);
        setEditingItem(null);
      }
    } catch (err) {
      setError("Error inesperado al guardar");
    }
    setLoading(false);
  }

  async function handleToggleActive(item: T) {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from(table)
        .update({ [activeField]: !(item as any)[activeField] })
        .eq("id", (item as any).id);
      if (error) setError(error.message);
      else await fetchItems();
    } catch (err) {
      setError("Error inesperado al cambiar estado");
    }
    setLoading(false);
  }

  return {
    items,
    loading,
    error,
    showForm,
    editingItem,
    filter,
    setFilter,
    fetchItems,
    handleNew,
    handleEdit,
    handleCancelForm,
    handleSave,
    handleToggleActive,
    setShowForm,
    setEditingItem,
  };
}
