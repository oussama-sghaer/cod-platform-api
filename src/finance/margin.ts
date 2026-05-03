import { OrderItemInput, OrderItemCogs, CostItem, MarginInput, MarginResult } from './finance.types';

export function calculateCogs(items: OrderItemInput[]): OrderItemCogs[] {
  return items.map((item) => ({
    variantId: item.variantId,
    batchItemId: item.batchItemId,
    unitCost: item.unitCost,
    quantity: item.quantity,
    totalCost: item.unitCost * item.quantity,
  }));
}
