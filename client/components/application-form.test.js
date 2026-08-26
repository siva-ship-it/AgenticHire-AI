import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { api } from '@/lib/api';
import { ApplicationForm } from './application-form';

jest.mock('@/lib/api', () => ({ api: jest.fn() }));

test('submits a public candidate application and confirms receipt', async () => {
  api.mockResolvedValue({ candidate: { id: 'candidate-1' } });
  render(<ApplicationForm jobId="507f1f77bcf86cd799439011"/>);

  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Jordan Candidate' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jordan@example.com' } });
  fireEvent.change(screen.getByLabelText(/Resume/), { target: { files: [new File(['resume'], 'resume.pdf', { type: 'application/pdf' })] } });
  fireEvent.submit(screen.getByRole('button', { name: 'Submit application' }).closest('form'));

  await waitFor(() => expect(api).toHaveBeenCalledWith('/candidates/upload', expect.objectContaining({ method: 'POST', body: expect.any(FormData) })));
  expect(await screen.findByText('Application received')).toBeInTheDocument();
});
