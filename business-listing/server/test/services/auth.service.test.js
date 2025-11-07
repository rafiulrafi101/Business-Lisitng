const User = require('../../src/models/User');
const { registerUser, loginUser } = require('../../src/services/auth.service');

describe('Auth Service', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('registers a new user with hashed password', async () => {
    const result = await registerUser({
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(result.user).toBeDefined();
    expect(result.user).not.toHaveProperty('passwordHash');

    const storedUser = await User.findOne({ email: 'alice@example.com' }).select('+passwordHash');
    expect(storedUser).toBeDefined();
    expect(storedUser.passwordHash).not.toBe('password123');
  });

  it('logs in an existing user', async () => {
    await registerUser({
      name: 'Bob Lee',
      email: 'bob@example.com',
      password: 'secret123',
    });

    const result = await loginUser({
      email: 'bob@example.com',
      password: 'secret123',
    });

    expect(result.user.email).toBe('bob@example.com');
    expect(result.token).toBeDefined();
  });
});
