import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ListingCard } from './ListingCard';
import { describe, it, expect } from 'vitest';

const mockListing = {
  _id: '123',
  name: 'Test Business',
  category: 'Haircut',
  location: {
    city: 'New York',
    area: 'Manhattan',
  },
  shortDescription: 'A great place for haircuts',
  imageUrl: 'https://example.com/image.jpg',
};

describe('ListingCard', () => {
  it('renders listing information correctly', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('Haircut')).toBeInTheDocument();
    expect(screen.getByText('New York, Manhattan')).toBeInTheDocument();
    expect(screen.getByText('A great place for haircuts')).toBeInTheDocument();
  });

  it('renders with an image', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );

    const image = screen.getByAltText('Test Business');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('displays "No Image" when imageUrl is not provided', () => {
    const listingWithoutImage = { ...mockListing, imageUrl: '' };

    render(
      <BrowserRouter>
        <ListingCard listing={listingWithoutImage} />
      </BrowserRouter>
    );

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('links to the correct listing detail page', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/listings/123');
  });
});
