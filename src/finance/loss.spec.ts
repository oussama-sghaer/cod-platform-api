import { calculateReturnLoss } from './loss';
import { ReturnLossInput } from './finance.types';

describe('calculateReturnLoss', () => {
  it('cogsLoss is 0 when all units are recovered', () => {
    const input: ReturnLossInput = {
      items: [
        { variantId: 'v1', batchItemId: 'b1', unitCost: 20, quantity: 3, quantityRecovered: 3 },
      ],
      costs: [{ kind: 'carrier_fee', amount: 5 }],
    };
    const result = calculateReturnLoss(input);
    expect(result.cogsLoss).toBe(0);
    expect(result.costsLoss).toBe(5);
    expect(result.totalLoss).toBe(5);
  });

  it('cogsLoss equals full COGS when no units are recovered', () => {
    const input: ReturnLossInput = {
      items: [
        { variantId: 'v1', batchItemId: 'b1', unitCost: 20, quantity: 3, quantityRecovered: 0 },
      ],
      costs: [{ kind: 'carrier_fee', amount: 5 }],
    };
    const result = calculateReturnLoss(input);
    expect(result.cogsLoss).toBe(60);
    expect(result.costsLoss).toBe(5);
    expect(result.totalLoss).toBe(65);
  });

  it('computes partial cogsLoss per item based on unrecovered quantity', () => {
    const input: ReturnLossInput = {
      items: [
        { variantId: 'v1', batchItemId: 'b1', unitCost: 20, quantity: 3, quantityRecovered: 1 },
        { variantId: 'v2', batchItemId: 'b2', unitCost: 10, quantity: 2, quantityRecovered: 2 },
      ],
      costs: [],
    };
    const result = calculateReturnLoss(input);
    // v1: (3 - 1) * 20 = 40 | v2: (2 - 2) * 10 = 0
    expect(result.cogsLoss).toBe(40);
    expect(result.totalLoss).toBe(40);
  });

  it('returns zero totalLoss for fully recovered return with no costs', () => {
    const input: ReturnLossInput = {
      items: [
        { variantId: 'v1', batchItemId: 'b1', unitCost: 20, quantity: 2, quantityRecovered: 2 },
      ],
      costs: [],
    };
    const result = calculateReturnLoss(input);
    expect(result.totalLoss).toBe(0);
  });
});
