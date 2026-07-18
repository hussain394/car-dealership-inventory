import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');

describe('LoginForm', () => {
  it('shows a server error toast when login fails', async () => {
    const login = vi.fn().mockRejectedValue({ response: { data: { error: 'Invalid email or password' } } });
    (useAuth as any).mockReturnValue({ login });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });
});
