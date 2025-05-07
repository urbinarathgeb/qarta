import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import { X } from 'lucide-react';

export interface ModalProps {
  /**
   * Título del modal
   */
  title: string;

  /**
   * Si el modal está visible
   */
  isOpen: boolean;

  /**
   * Función para cerrar el modal
   */
  onClose: () => void;

  /**
   * Contenido del modal
   */
  children: React.ReactNode;

  /**
   * Ancho máximo del modal
   */
  maxWidth?: string;

  /**
   * Si se debe bloquear el cierre al hacer clic fuera
   */
  blockOutsideClose?: boolean;
}

/**
 * Componente Modal reutilizable para mostrar contenido en una ventana flotante
 */
const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  blockOutsideClose = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !blockOutsideClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, blockOutsideClose]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !blockOutsideClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="overflow-y-auto p-6 flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
