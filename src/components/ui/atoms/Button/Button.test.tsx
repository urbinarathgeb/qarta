import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Botón de prueba</Button>);
    const button = screen.getByRole('button', { name: /Botón de prueba/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="danger">Botón de peligro</Button>);
    const button = screen.getByRole('button', { name: /Botón de peligro/i });
    expect(button).toHaveClass('bg-red-100');
    expect(button).toHaveClass('text-red-700');
  });

  it('shows loading state when isLoading is true', () => {
    render(<Button isLoading>Cargando</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Botón de acción</Button>);
    const button = screen.getByRole('button', { name: /Botón de acción/i });

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Botón deshabilitado
      </Button>
    );
    const button = screen.getByRole('button', { name: /Botón deshabilitado/i });

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});
