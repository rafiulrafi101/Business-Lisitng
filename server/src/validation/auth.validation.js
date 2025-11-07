const { z } = require('zod');

const emailSchema = z.string().email().max(100);
const passwordSchema = z.string().min(6).max(100);

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: emailSchema,
    password: passwordSchema,
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
