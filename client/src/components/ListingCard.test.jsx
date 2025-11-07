import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ListingCard from './ListingCard.jsx';

const listing = {
  id: '1',
  name: 'Test Listing',
  category: 'Haircut',
  location: { city: 'Metro', area: 'Central' },
  shortDescription: 'A wonderful place for services.',
  phone: '555-1234',
  hours: 'Mon-Fri 9am-5pm',
  imageUrl: 'https://example.com/image.jpg',
};

describe('ListingCard', () => {
  it('renders listing information', () => {
    render(
      <MemoryRouter>
        <ListingCard listing={listing} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Test Listing/)).toBeInTheDocument();
    expect(screen.getByText(/Haircut/)).toBeInTheDocument();
    expect(screen.getByText(/Central/)).toBeInTheDocument();
  });

  it('invokes bookmark handler when clicked', async () => {
    const user = userEvent.setup();
    const onBookmarkToggle = vi.fn();
    render(
      <MemoryRouter>
        <ListingCard listing={listing} onBookmarkToggle={onBookmarkToggle} />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /bookmark/i }));
    expect(onBookmarkToggle).toHaveBeenCalledWith('1');
  });
});
