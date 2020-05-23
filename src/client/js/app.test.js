// for async functions
import "@babel/polyfill";
require("@babel/polyfill");

import { handleApp } from './app';

describe('the handleApp function', () => {
  test('should exist', async () => {
    expect(handleApp).toBeDefined();
  });
  test('should be a function', async () => {
    expect(typeof handleApp).toBe('function');
  });
});
