import format from './formatDeliveryEstimate';

describe('Rate formatting', () => {
  it('formats rate using default NUMBER_OF_RATE_SIGNIFICANT_DIGITS', () => {
    expect(format('2015-05-09T00:00:00Z', 'en')).toEqual('by May 6');
  });
});
