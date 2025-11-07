const { z } = require('zod');
const { objectId } = require('./common');

const bookmarkParamSchema = {
  params: z.object({
    listingId: objectId,
  }),
};

module.exports = {
  bookmarkParamSchema,
};
