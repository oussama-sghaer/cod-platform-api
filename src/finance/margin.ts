import { Decimal } from 'decimal.js';
import {
  OrderItemInput,
  OrderItemCogs,
  CostItem,
  MarginInput,
  MarginResult,
} from './finance.types';

export function calculateCogs(items: OrderItemInput[]): OrderItemCogs[] {
  return items.map((item) => ({
    variantId: item.variantId,
    batchItemId: item.batchItemId,
    unitCost: item.unitCost,
    quantity: item.quantity,
    totalCost: item.unitCost.times(item.quantity),
  }));
}

export function calculateTotalCosts(costs: CostItem[]): Decimal {
  return costs.reduce((sum, cost) => sum.plus(cost.amount), new Decimal(0));
}

export function calculateMargin(input: MarginInput): MarginResult {
  const itemsWithCogs = calculateCogs(input.items);
  const cogs = itemsWithCogs.reduce(
    (sum, item) => sum.plus(item.totalCost),
    new Decimal(0),
  );
  const totalCosts = calculateTotalCosts(input.costs);
  return {
    revenue: input.revenue,
    cogs,
    totalCosts,
    grossMargin: input.revenue.minus(cogs).minus(totalCosts),
    breakdown: {
      items: itemsWithCogs,
      costs: input.costs,
    },
  };
}
