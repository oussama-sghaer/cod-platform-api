import { Decimal } from 'decimal.js';
import { calculateReturnLoss, calculateDamageLoss } from './loss';
import { ReturnLossInput, DamageLossInput } from './finance.types';

describe('calculateReturnLoss', () => {
  it('cogsLoss is 0 when all units are recovered', () => {
    const input: ReturnLossInput = {
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(20),
          quantity: 3,
          quantityRecovered: 3,
        },
      ],
      costs: [{ kind: 'carrier_fee', amount: new Decimal(5) }],
    };
    const result = calculateReturnLoss(input);
    expect(result.cogsLoss.equals(0)).toBe(true);
    expect(result.costsLoss.equals(5)).toBe(true);
    expect(result.totalLoss.equals(5)).toBe(true);
  });

  it('cogsLoss equals full COGS when no units are recovered', () => {
    const input: ReturnLossInput = {
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(20),
          quantity: 3,
          quantityRecovered: 0,
        },
      ],
      costs: [{ kind: 'carrier_fee', amount: new Decimal(5) }],
    };
    const result = calculateReturnLoss(input);
    expect(result.cogsLoss.equals(60)).toBe(true);
    expect(result.costsLoss.equals(5)).toBe(true);
    expect(result.totalLoss.equals(65)).toBe(true);
  });

  it('computes partial cogsLoss per item based on unrecovered quantity', () => {
    const input: ReturnLossInput = {
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(20),
          quantity: 3,
          quantityRecovered: 1,
        },
        {
          variantId: 'v2',
          batchItemId: 'b2',
          unitCost: new Decimal(10),
          quantity: 2,
          quantityRecovered: 2,
        },
      ],
      costs: [],
    };
    const result = calculateReturnLoss(input);
    // v1: (3 - 1) * 20 = 40 | v2: (2 - 2) * 10 = 0
    expect(result.cogsLoss.equals(40)).toBe(true);
    expect(result.totalLoss.equals(40)).toBe(true);
  });

  it('returns zero totalLoss for fully recovered return with no costs', () => {
    const input: ReturnLossInput = {
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(20),
          quantity: 2,
          quantityRecovered: 2,
        },
      ],
      costs: [],
    };
    const result = calculateReturnLoss(input);
    expect(result.totalLoss.equals(0)).toBe(true);
  });
});

describe('calculateDamageLoss', () => {
  it('cogsLoss equals full COGS for a single item', () => {
    const input: DamageLossInput = {
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(30),
          quantity: 2,
        },
      ],
      costs: [{ kind: 'carrier_fee', amount: new Decimal(8) }],
    };
    const result = calculateDamageLoss(input);
    expect(result.cogsLoss.equals(60)).toBe(true);
    expect(result.costsLoss.equals(8)).toBe(true);
    expect(result.totalLoss.equals(68)).toBe(true);
  });

  it('sums cogsLoss across multiple items', () => {
    const input: DamageLossInput = {
      items: [
        {
          variantId: 'v1',
          batchItemId: 'b1',
          unitCost: new Decimal(30),
          quantity: 2,
        },
        {
          variantId: 'v2',
          batchItemId: 'b2',
          unitCost: new Decimal(10),
          quantity: 3,
        },
      ],
      costs: [],
    };
    const result = calculateDamageLoss(input);
    // (30 * 2) + (10 * 3) = 60 + 30 = 90
    expect(result.cogsLoss.equals(90)).toBe(true);
    expect(result.totalLoss.equals(90)).toBe(true);
  });

  it('returns only costsLoss when items array is empty', () => {
    const input: DamageLossInput = {
      items: [],
      costs: [{ kind: 'carrier_fee', amount: new Decimal(5) }],
    };
    const result = calculateDamageLoss(input);
    expect(result.cogsLoss.equals(0)).toBe(true);
    expect(result.costsLoss.equals(5)).toBe(true);
    expect(result.totalLoss.equals(5)).toBe(true);
  });
});
