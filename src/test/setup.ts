import '@testing-library/jest-dom';
import { beforeAll, afterEach } from 'vitest';

// Setup for potential MSW integration in the future
// import { server } from './mocks/server';

// Setup MSW (when implemented in Phase 2)
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// Global test setup
beforeAll(() => {
  // Global setup for all tests
});

afterEach(() => {
  // Cleanup after each test
});
