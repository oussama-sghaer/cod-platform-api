import { Decimal } from 'decimal.js';
import { calculateCogs, calculateTotalCosts, calculateMargin } from './margin';
import { OrderItemInput, CostItem, MarginInput } from './finance.types';

describe('calculateCogs', () => {
  it('returns totalCost = unitCost × quantity for a single item', () => {
    const items: OrderItemInput[] = [
      {
        variantId: 'v1',
        batchItemId: 'b1',
        unitCost: new Decimal(10),
        quantity: 3,
      },
    ];
    const result = calculateCogs(items);
    expect(result).toEqual([
      {
        variantId: 'v1',
        batchItemId: 'b1',
        unitCost: new Decimal(10),
        quantity: 3,
        totalCost: new Decimal(30),
      },
    ]);
  });

  it('computes totalCost independently for each item', () => {
    const items: OrderItemInput[] = [
      {
        variantId: 'v1',
        batchItemId: 'b1',
        unitCost: new Decimal(10),
        quantity: 3,
      },
      {
        variantId: 'v2',
        batchItemId: 'b2',
        unitCost: new Decimal(5),
        quantity: 2,
      },
    ];
    const result = calculateCogs(items);
    expect(result[0].totalCost.equals(30)).toBe(true);
    expect(result[1].totalCost.equals(10)).toBe(true);
  });

  it('returns empty array for empty input', () => {
    expect(calculateCogs([])).toEqual([]);
  });

  it('returns totalCost = 0 when unitCost is 0', () => {
    const items: OrderItemInput[] = [
      {
        variantId: 'v1',
        batchItemId: 'b1',
        unitCost: new Decimal(0),
        quantity: 5,
      },
    ];
    expect(calculateCogs(items)[0].totalCost.equals(0)).toBe(true);
  });

  it('returns totalCost = 0 when quantity is 0', () => {
    const items: OrderItemInput[] = [
      {
        variantId: 'v1',
        batchItemId: 'b1',
        unitCost: new Decimal(10),
        quantity: 0,
      },
    ];
    expect(calculateCogs(items)[0].totalCost.equals(0)).toBe(true);
  });
});

describe('calculateTotalCosts', () => {
  it('sums amounts across all cost items', () => {
    const costs: CostItem[] = [
      { kind: 'carrier_fee', amount: new Decimal(5) },
      { kind: 'packaging', amount: new Decimal(2) },
    ];
    expect(calculateTotalCosts(costs).equals(7)).toBe(true);
  });

  it('returns 0 for empty costs array', () => {
    expect(calculateTotalCosts([]).equals(0)).toBe(true);
  });

  it('returns the amount for a single cost item', () => {
    const costs: CostItem[] = [{ kind: 'carrier_fee', amount: new Decimal(8) }];
    expect(calculateTotalCosts(costs).equals(8)).toBe(true);
  });

  it('returns 0 when all amounts are 0', () => {
    const costs: CostItem[] = [
      { kind: 'carrier_fee', amount: new Decimal(0) },
      { kind: 'packaging', amount: new Decimal(0) },
    ];
    expect(calculateTotalCosts(costs).equals(0)).toBe(true);
  });
});

describe('calculateMargin', () => {
  it('calculates positive gross margin correctly', () => {
    const input: MarginInput = {
      revenue: new Decimal(100),
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(40),
          quantity: 1,
        },
      ],
      costs: [{ kind: 'carrier_fee', amount: new Decimal(10) }],
    };
    const result = calculateMargin(input);
    expect(result.cogs.equals(40)).toBe(true);
    expect(result.totalCosts.equals(10)).toBe(true);
    expect(result.grossMargin.equals(50)).toBe(true);
    expect(result.revenue.equals(100)).toBe(true);
  });

  it('returns negative gross margin when costs exceed revenue', () => {
    const input: MarginInput = {
      revenue: new Decimal(30),
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(40),
          quantity: 1,
        },
      ],
      costs: [{ kind: 'carrier_fee', amount: new Decimal(10) }],
    };
    const result = calculateMargin(input);
    expect(result.grossMargin.equals(-20)).toBe(true);
  });

  it('returns zero gross margin when revenue equals cogs plus costs', () => {
    const input: MarginInput = {
      revenue: new Decimal(50),
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(40),
          quantity: 1,
        },
      ],
      costs: [{ kind: 'carrier_fee', amount: new Decimal(10) }],
    };
    const result = calculateMargin(input);
    expect(result.grossMargin.equals(0)).toBe(true);
  });

  it('includes per-item breakdown in result', () => {
    const input: MarginInput = {
      revenue: new Decimal(100),
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(40),
          quantity: 1,
        },
      ],
      costs: [],
    };
    const result = calculateMargin(input);
    expect(result.breakdown.items[0].totalCost.equals(40)).toBe(true);
  });

  it('passes costs through to breakdown unchanged', () => {
    const costs: CostItem[] = [
      { kind: 'carrier_fee', amount: new Decimal(10) },
    ];
    const input: MarginInput = { revenue: new Decimal(100), items: [], costs };
    const result = calculateMargin(input);
    expect(result.breakdown.costs).toEqual(costs);
  });

  it('handles empty items and empty costs', () => {
    const input: MarginInput = {
      revenue: new Decimal(100),
      items: [],
      costs: [],
    };
    const result = calculateMargin(input);
    expect(result.cogs.equals(0)).toBe(true);
    expect(result.totalCosts.equals(0)).toBe(true);
    expect(result.grossMargin.equals(100)).toBe(true);
  });

  it('handles fractional costs without float drift', () => {
    const input: MarginInput = {
      revenue: new Decimal(1),
      items: [],
      costs: [
        { kind: 'fee_a', amount: new Decimal('0.1') },
        { kind: 'fee_b', amount: new Decimal('0.2') },
      ],
    };
    const result = calculateMargin(input);
    expect(result.totalCosts.equals('0.3')).toBe(true);
    expect(result.grossMargin.equals('0.7')).toBe(true);
  });
});
