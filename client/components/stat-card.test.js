import { render, screen } from '@testing-library/react';
import { StatCard } from './stat-card';

test('renders a recruitment metric and supporting note', () => {
  render(<StatCard label="Active workflows" value="12" note="Includes approval checkpoints"/>);
  expect(screen.getByText('Active workflows')).toBeInTheDocument();
  expect(screen.getByText('12')).toBeInTheDocument();
  expect(screen.getByText('Includes approval checkpoints')).toBeInTheDocument();
});
