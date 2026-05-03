import { calculateCogs } from './margin';
import { OrderItemInput } from './finance.types';

describe('calculateCogs', () => {
  it('returns totalCost = unitCost × quantity for a single item', () => {
    const items: OrderItemInput[] = [
      { variantId: 'v1', batchItemId: 'b1', unitCost: 10, quantity: 3 },
    ];
    const result = calculateCogs(items);
    expect(result).toEqual([
      { variantId: 'v1', batchItemId: 'b1', unitCost: 10, quantity: 3, totalCost: 30 },
    ]);
  });

  it('computes totalCost independently for each item', () => {
    const items: OrderItemInput[] = [
      { variantId: 'v1', batchItemId: 'b1', unitCost: 10, quantity: 3 },
      { variantId: 'v2', batchItemId: 'b2', unitCost: 5, quantity: 2 },
    ];
    const result = calculateCogs(items);
    expect(result[0].totalCost).toBe(30);
    expect(result[1].totalCost).toBe(10);
  });

  it('returns empty array for empty input', () => {
    expect(calculateCogs([])).toEqual([]);
  });

  it('returns totalCost = 0 when unitCost is 0', () => {
    const items: OrderItemInput[] = [
      { variantId: 'v1', batchItemId: 'b1', unitCost: 0, quantity: 5 },
    ];
    expect(calculateCogs(items)[0].totalCost).toBe(0);
  });

  it('returns totalCost = 0 when quantity is 0', () => {
    const items: OrderItemInput[] = [
      { variantId: 'v1', batchItemId: 'b1', unitCost: 10, quantity: 0 },
    ];
    expect(calculateCogs(items)[0].totalCost).toBe(0);
  });
});
