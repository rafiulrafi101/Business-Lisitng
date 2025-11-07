import { jest } from '@jest/globals';
import { listingService } from '../../src/services/listing.service.js';
import { Listing } from '../../src/models/Listing.js';
import { ApiError } from '../../src/utils/ApiError.js';

// Mock the Listing model
jest.unstable_mockModule('../../src/models/Listing.js', () => ({
  Listing: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe('Listing Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListings', () => {
    it('should return paginated listings with filters', async () => {
      const mockListings = [
        {
          _id: '1',
          name: 'Test Business',
          category: 'Haircut',
          location: { city: 'New York', area: 'Manhattan' },
        },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockListings),
      };

      Listing.find = jest.fn().mockReturnValue(mockQuery);
      Listing.countDocuments = jest.fn().mockResolvedValue(10);

      const result = await listingService.getListings({
        category: 'Haircut',
        page: 1,
        limit: 12,
      });

      expect(result.listings).toEqual(mockListings);
      expect(result.pagination.total).toBe(10);
      expect(result.pagination.page).toBe(1);
      expect(Listing.find).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
          category: 'Haircut',
        })
      );
    });
  });

  describe('getListingById', () => {
    it('should return a listing by id', async () => {
      const mockListing = {
        _id: '1',
        name: 'Test Business',
        category: 'Haircut',
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockListing),
      };

      Listing.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await listingService.getListingById('1');

      expect(result).toEqual(mockListing);
      expect(Listing.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error if listing not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      };

      Listing.findById = jest.fn().mockReturnValue(mockQuery);

      await expect(listingService.getListingById('999')).rejects.toThrow(ApiError);
    });
  });

  describe('createListing', () => {
    it('should create a new listing', async () => {
      const userId = 'user123';
      const listingData = {
        name: 'New Business',
        category: 'Haircut',
        location: { city: 'New York', area: 'Manhattan' },
        shortDescription: 'A great place',
        description: 'Full description here',
      };

      const mockCreatedListing = { _id: 'listing123', ...listingData, owner: userId };

      Listing.create = jest.fn().mockResolvedValue(mockCreatedListing);

      const result = await listingService.createListing(userId, listingData);

      expect(result).toEqual(mockCreatedListing);
      expect(Listing.create).toHaveBeenCalledWith({
        ...listingData,
        owner: userId,
      });
    });
  });
});
