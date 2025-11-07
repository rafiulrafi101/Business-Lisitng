const authService = require('../src/services/auth.service');
const User = require('../src/models/User');
const ApiError = require('../src/utils/ApiError');

describe('auth.service', () => {
  test('registerUser creates user and returns token', async () => {
    const result = await authService.registerUser({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(result.user).toMatchObject({
      name: 'Alice',
      email: 'alice@example.com',
      role: 'user',
    });
    expect(result.token).toBeDefined();

    const stored = await User.findOne({ email: 'alice@example.com' });
    expect(stored).not.toBeNull();
    expect(stored.passwordHash).not.toBe('password123');
  });

  test('registerUser rejects duplicate email', async () => {
    await authService.registerUser({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password123',
    });

    await expect(
      authService.registerUser({
        name: 'Bobby',
        email: 'bob@example.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
