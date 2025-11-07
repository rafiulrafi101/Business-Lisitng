import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListingCard from '../ListingCard.jsx';
import { AuthContext } from '../../state/AuthContext.jsx';

const renderWithAuth = (ui, { user = null } = {}) =>
  render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>,
  );

describe('ListingCard', () => {
  it('renders listing information', () => {
    const listing = {
      id: '1',
      name: 'City Cuts',
      category: 'Haircut',
      shortDescription: 'Quality haircuts in the heart of downtown.',
      location: { city: 'Springfield', area: 'Downtown' },
    };

    renderWithAuth(<ListingCard listing={listing} />);

    expect(screen.getByText('City Cuts')).toBeInTheDocument();
    expect(screen.getByText('Haircut')).toBeInTheDocument();
    expect(screen.getByText('Springfield, Downtown')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view details/i })).toBeInTheDocument();
  });
});
