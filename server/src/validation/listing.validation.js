const { z } = require('zod');

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const categories = ['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'];

const locationSchema = z.object({
  city: z.string().min(2).max(100),
  area: z.string().min(2).max(100),
});

const baseListingBody = z.object({
  name: z.string().min(2).max(200),
  category: z.enum(categories),
  location: locationSchema,
  shortDescription: z.string().min(10).max(200),
  description: z.string().min(20).max(2000),
  phone: z.string().min(5).max(50),
  hours: z.string().min(2).max(200),
  imageUrl: z.string().url().max(500).optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

const listQuerySchema = z.object({
  query: z.object({
    search: z.string().max(100).optional(),
    category: z.enum(categories).optional(),
    city: z.string().max(100).optional(),
    area: z.string().max(100).optional(),
    sort: z.enum(['newest', 'az']).optional(),
    page: z
      .string()
      .regex(/^[0-9]+$/)
      .optional(),
    limit: z
      .string()
      .regex(/^[0-9]+$/)
      .optional(),
  }),
});

const listingIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

const createListingSchema = z.object({
  body: baseListingBody,
});

const updateListingSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: baseListingBody,
});

const deleteListingSchema = listingIdParamSchema;

module.exports = {
  listQuerySchema,
  listingIdParamSchema,
  createListingSchema,
  updateListingSchema,
  deleteListingSchema,
};
