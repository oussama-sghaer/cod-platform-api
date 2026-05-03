import { Decimal } from 'decimal.js';

export interface OrderItemInput {
  variantId: string;
  batchItemId: string;
  unitCost: Decimal;
  quantity: number;
}

export interface ReturnItemInput extends OrderItemInput {
  quantityRecovered: number;
}

export interface CostItem {
  kind: string;
  amount: Decimal;
  referenceId?: string;
}

export interface MarginInput {
  revenue: Decimal;
  items: OrderItemInput[];
  costs: CostItem[];
}

export interface OrderItemCogs {
  variantId: string;
  batchItemId: string;
  unitCost: Decimal;
  quantity: number;
  totalCost: Decimal;
}

export interface MarginResult {
  revenue: Decimal;
  cogs: Decimal;
  totalCosts: Decimal;
  grossMargin: Decimal;
  breakdown: {
    items: OrderItemCogs[];
    costs: CostItem[];
  };
}

export interface ReturnLossInput {
  items: ReturnItemInput[];
  costs: CostItem[];
}

export interface DamageLossInput {
  items: OrderItemInput[];
  costs: CostItem[];
}

export interface LossResult {
  cogsLoss: Decimal;
  costsLoss: Decimal;
  totalLoss: Decimal;
}
