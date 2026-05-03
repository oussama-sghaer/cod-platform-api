import { calculateCogs, calculateTotalCosts, calculateMargin } from './margin';
import { OrderItemInput, CostItem, MarginInput } from './finance.types';

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

describe('calculateMargin', () => {
  it('calculates positive gross margin correctly', () => {
    const input: MarginInput = {
      revenue: 100,
      items: [{ variantId: 'v1', batchItemId: 'b1', unitCost: 40, quantity: 1 }],
      costs: [{ kind: 'carrier_fee', amount: 10 }],
    };
    const result = calculateMargin(input);
    expect(result.cogs).toBe(40);
    expect(result.totalCosts).toBe(10);
    expect(result.grossMargin).toBe(50);
    expect(result.revenue).toBe(100);
  });

  it('returns negative gross margin when costs exceed revenue', () => {
    const input: MarginInput = {
      revenue: 30,
      items: [{ variantId: 'v1', batchItemId: 'b1', unitCost: 40, quantity: 1 }],
      costs: [{ kind: 'carrier_fee', amount: 10 }],
    };
    const result = calculateMargin(input);
    expect(result.grossMargin).toBe(-20);
  });

  it('returns zero gross margin when revenue equals cogs plus costs', () => {
    const input: MarginInput = {
      revenue: 50,
      items: [{ variantId: 'v1', batchItemId: 'b1', unitCost: 40, quantity: 1 }],
      costs: [{ kind: 'carrier_fee', amount: 10 }],
    };
    const result = calculateMargin(input);
    expect(result.grossMargin).toBe(0);
  });

  it('includes per-item breakdown in result', () => {
    const input: MarginInput = {
      revenue: 100,
      items: [{ variantId: 'v1', batchItemId: 'b1', unitCost: 40, quantity: 1 }],
      costs: [],
    };
    const result = calculateMargin(input);
    expect(result.breakdown.items[0].totalCost).toBe(40);
  });

  it('passes costs through to breakdown unchanged', () => {
    const costs: CostItem[] = [{ kind: 'carrier_fee', amount: 10 }];
    const input: MarginInput = { revenue: 100, items: [], costs };
    const result = calculateMargin(input);
    expect(result.breakdown.costs).toEqual(costs);
  });

  it('handles empty items and empty costs', () => {
    const input: MarginInput = { revenue: 100, items: [], costs: [] };
    const result = calculateMargin(input);
    expect(result.cogs).toBe(0);
    expect(result.totalCosts).toBe(0);
    expect(result.grossMargin).toBe(100);
  });
});
