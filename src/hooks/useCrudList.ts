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
      console.log(`Fetching items from ${table}...`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        setItems([]); // Limpia items si hay error
        console.error(`Error al obtener datos de ${table}:`, error.message);
      } else {
        console.log(`Fetched ${data?.length || 0} items from ${table}.`);
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

  // Cargar items al montar el componente
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [table]);

  // Suscribirse a cambios en la tabla
  useEffect(() => {
    console.log(`Setting up subscription for table: ${table}`);

    const subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        console.log(`Change detected in ${table}:`, payload);
        fetchItems();
      })
      .subscribe((status) => {
        console.log(`Subscription status for ${table}:`, status);
      });

    return () => {
      console.log(`Cleaning up subscription for ${table}`);
      subscription.unsubscribe();
    };
  }, [table]);

  function handleNew() {
    setEditingItem(null);
    setShowForm(true);
  }

  function handleEdit(item: T) {
    console.log('handleEdit called with item:', item);
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

    console.log('------- GUARDANDO EN LA BASE DE DATOS -------');
    console.log('handleSave ejecutándose con los siguientes datos:', {
      isEdit,
      itemId: isEdit ? (editingItem as any).id : 'nuevo registro',
      tabla: table,
      datos: itemData
    });

    const dataToSave = isEdit ? { ...(editingItem as any), ...itemData } : itemData;
    if (!isEdit && dataToSave[activeField] === undefined) dataToSave[activeField] = true;
    if (typeof dataToSave.price === 'string') dataToSave.price = Number(dataToSave.price);

    console.log('Datos a guardar en Supabase:', dataToSave);

    try {
      let error;
      if (isEdit) {
        console.log(`Actualizando item en ${table} con id:`, (editingItem as any).id);
        ({ error } = await supabase
          .from(table)
          .update(dataToSave)
          .eq('id', (editingItem as any).id));
      } else {
        console.log(`Insertando nuevo item en ${table}`);
        ({ error } = await supabase.from(table).insert([dataToSave]));
      }
      if (error) {
        setError(error.message);
        console.error(`Error al guardar en ${table}:`, error.message);
      } else {
        console.log(`Guardado exitoso en ${table}`);
        // La actualización ahora se manejará a través de la suscripción
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
      console.log(`Toggling ${activeField} for item in ${table} with id:`, (item as any).id);
      console.log('Current value:', (item as any)[activeField]);

      const { error } = await supabase
        .from(table)
        .update({ [activeField]: !(item as any)[activeField] })
        .eq('id', (item as any).id);

      if (error) {
        setError(error.message);
        console.error(`Error al cambiar estado en ${table}:`, error.message);
      } else {
        console.log(`Successfully toggled ${activeField} in ${table}`);
        // La actualización ahora se manejará a través de la suscripción
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
