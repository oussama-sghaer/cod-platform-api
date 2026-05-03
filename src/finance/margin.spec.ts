import { calculateCogs, calculateTotalCosts } from './margin';
import { OrderItemInput, CostItem } from './finance.types';

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

describe('calculateTotalCosts', () => {
  it('sums amounts across all cost items', () => {
    const costs: CostItem[] = [
      { kind: 'carrier_fee', amount: 5 },
      { kind: 'packaging', amount: 2 },
    ];
    expect(calculateTotalCosts(costs)).toBe(7);
  });

  it('returns 0 for empty costs array', () => {
    expect(calculateTotalCosts([])).toBe(0);
  });

  it('returns the amount for a single cost item', () => {
    const costs: CostItem[] = [{ kind: 'carrier_fee', amount: 8 }];
    expect(calculateTotalCosts(costs)).toBe(8);
  });

  it('returns 0 when all amounts are 0', () => {
    const costs: CostItem[] = [
      { kind: 'carrier_fee', amount: 0 },
      { kind: 'packaging', amount: 0 },
    ];
    expect(calculateTotalCosts(costs)).toBe(0);
  });
});
