const { z } = require('zod');
const { objectId } = require('./common');

const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
});

const categoryValues = ['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'];

const createListingSchema = {
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    category: z.enum(categoryValues),
    location: locationSchema,
    shortDescription: z.string().min(10).max(160),
    description: z.string().min(20),
    phone: z.string().min(5).max(30).optional(),
    hours: z.string().min(3).optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
};

const updateListingSchema = {
  body: z
    .object({
      name: z.string().min(3).optional(),
      category: z.enum(categoryValues).optional(),
      location: locationSchema.partial().optional(),
      shortDescription: z.string().min(10).max(160).optional(),
      description: z.string().min(20).optional(),
      phone: z.string().min(5).max(30).optional(),
      hours: z.string().min(3).optional(),
      imageUrl: z.string().url().optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
  params: z.object({
    id: objectId,
  }),
};

const listingIdParamSchema = {
  params: z.object({
    id: objectId,
  }),
};

const listingQuerySchema = {
  query: z.object({
    search: z.string().optional(),
    category: z.enum(categoryValues).optional(),
    city: z.string().optional(),
    area: z.string().optional(),
    sort: z.enum(['newest', 'az']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  }),
};

module.exports = {
  createListingSchema,
  updateListingSchema,
  listingIdParamSchema,
  listingQuerySchema,
  categoryValues,
};
