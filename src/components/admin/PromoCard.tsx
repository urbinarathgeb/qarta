import React from 'react';
import type { Promo, PromoCardProps } from '@/types/promo';
import GenericEntityCard from '@/components/ui/molecules/GenericEntityCard';

const PromoCard: React.FC<PromoCardProps> = ({ item: promo, onToggleActive, onEdit }) => {
  return (
    <GenericEntityCard
      item={promo}
      title={promo.title}
      category={String(promo.type)}
      price={promo.price}
      isActive={promo.active}
      onToggleActive={() => onToggleActive(promo)}
      onEdit={onEdit ? () => onEdit(promo) : undefined}
      additionalInfo={
        promo.description && <p className="text-sm text-gray-400 mb-2">{promo.description}</p>
      }
    />
  );
};

export default PromoCard;
