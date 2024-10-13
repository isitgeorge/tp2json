import { describe, expect, test, jest, beforeEach, } from '@jest/globals';
import tp2json from './index.js';
import { Config } from './types/config.js';

describe('tp2json', () => {
  test('pull 10 reviews', async () => {
    const reviewCount = 10
    const config: Config = {
      country: 'uk',
      profile: 'www.monzo.com',
      limit: reviewCount
    }
    const reviews = await tp2json(config)
    await new Promise(process.nextTick);
    expect(reviews.length).toBe(reviewCount)
  }, 30 * 1000);

  test('pull 50 reviews', async () => {
    const reviewCount = 50
    const config: Config = {
      country: 'uk',
      profile: 'starlingbank.com',
      limit: reviewCount
    }
    const reviews = await tp2json(config)
    await new Promise(process.nextTick);
    expect(reviews.length).toBe(reviewCount)
  }, 30 * 1000);

  test('pull 100 reviews', async () => {
    const reviewCount = 100
    const config: Config = {
      country: 'uk',
      profile: 'tide.co',
      limit: reviewCount
    }
    const reviews = await tp2json(config)
    await new Promise(process.nextTick);
    expect(reviews.length).toBe(reviewCount)
  }, 30 * 1000);
});
