const { z } = require('zod');

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const bookmarkParamSchema = z.object({
  params: z.object({
    listingId: objectIdSchema,
  }),
});

module.exports = {
  bookmarkParamSchema,
};
