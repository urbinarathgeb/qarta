import React from 'react';
import type { Dish, DishCardProps } from '@/types/dish';
import GenericEntityCard from '@/components/ui/molecules/GenericEntityCard';

const DishCard: React.FC<DishCardProps> = ({ item: dish, onToggleActive, onEdit }) => (
  <GenericEntityCard
    item={dish}
    title={dish.name}
    category={String(dish.category)}
    price={dish.price}
    isActive={dish.available}
    onToggleActive={() => onToggleActive(dish)}
    onEdit={onEdit ? () => onEdit(dish) : undefined}
  />
);

export default DishCard;
