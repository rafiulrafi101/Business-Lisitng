import { jest } from '@jest/globals';
import { listingController } from '../../src/controllers/listing.controller.js';
import { listingService } from '../../src/services/listing.service.js';

// Mock the listing service
jest.unstable_mockModule('../../src/services/listing.service.js', () => ({
  listingService: {
    getListings: jest.fn(),
    getListingById: jest.fn(),
    createListing: jest.fn(),
  },
}));

describe('Listing Controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
      body: {},
      user: { _id: 'user123', role: 'user' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListings', () => {
    it('should return listings with pagination', async () => {
      const mockData = {
        listings: [{ name: 'Test Business' }],
        pagination: { page: 1, limit: 12, total: 1, pages: 1 },
      };

      listingService.getListings = jest.fn().mockResolvedValue(mockData);

      await listingController.getListings(mockReq, mockRes, mockNext);

      expect(listingService.getListings).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
    });
  });

  describe('getListingById', () => {
    it('should return a single listing', async () => {
      const mockListing = { _id: '1', name: 'Test Business' };
      mockReq.params.id = '1';

      listingService.getListingById = jest.fn().mockResolvedValue(mockListing);

      await listingController.getListingById(mockReq, mockRes, mockNext);

      expect(listingService.getListingById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockListing,
      });
    });
  });

  describe('createListing', () => {
    it('should create a new listing', async () => {
      const listingData = {
        name: 'New Business',
        category: 'Haircut',
        location: { city: 'New York', area: 'Manhattan' },
        shortDescription: 'Great place',
        description: 'Full description',
      };
      mockReq.body = listingData;

      const mockCreatedListing = { _id: 'listing123', ...listingData };

      listingService.createListing = jest.fn().mockResolvedValue(mockCreatedListing);

      await listingController.createListing(mockReq, mockRes, mockNext);

      expect(listingService.createListing).toHaveBeenCalledWith('user123', listingData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedListing,
      });
    });
  });
});
