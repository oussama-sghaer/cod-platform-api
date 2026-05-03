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
    totalCost: item.unitCost * item.quantity,
  }));
}

export function calculateTotalCosts(costs: CostItem[]): number {
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
}

export function calculateMargin(input: MarginInput): MarginResult {
  const itemsWithCogs = calculateCogs(input.items);
  const cogs = itemsWithCogs.reduce((sum, item) => sum + item.totalCost, 0);
  const totalCosts = calculateTotalCosts(input.costs);
  return {
    revenue: input.revenue,
    cogs,
    totalCosts,
    grossMargin: input.revenue - cogs - totalCosts,
    breakdown: {
      items: itemsWithCogs,
      costs: input.costs,
    },
  };
}
