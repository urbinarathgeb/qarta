import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { FilterType, UseCrudListOptions } from '@/types/common';

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
    setError(null);
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        setItems([]); // Limpia items si hay error
        console.error(`Error al obtener datos de ${table}:`, error.message);
      } else {
        setItems(mapItem ? data.map(mapItem) : data || []);
        setError(null);
      }
    } catch (err) {
      setError('Error inesperado al obtener datos');
      setItems([]);
      console.error(`Error inesperado al obtener datos de ${table}:`, err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [table]);

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
        ({ error } = await supabase
          .from(table)
          .update(dataToSave)
          .eq('id', (editingItem as any).id));
      } else {
        ({ error } = await supabase.from(table).insert([dataToSave]));
      }
      if (error) {
        setError(error.message);
        console.error(`Error al guardar en ${table}:`, error.message);
      } else {
        await fetchItems();
        setShowForm(false);
        setEditingItem(null);
      }
    } catch (err) {
      setError('Error inesperado al guardar');
      console.error(`Error inesperado al guardar en ${table}:`, err);
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
        .eq('id', (item as any).id);
      if (error) {
        setError(error.message);
        console.error(`Error al cambiar estado en ${table}:`, error.message);
      } else {
        await fetchItems();
      }
    } catch (err) {
      setError('Error inesperado al cambiar estado');
      console.error(`Error inesperado al cambiar estado en ${table}:`, err);
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
