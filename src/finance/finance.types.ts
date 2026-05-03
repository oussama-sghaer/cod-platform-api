export interface OrderItemInput {
  variantId: string;
  batchItemId: string;
  unitCost: number;
  quantity: number;
}

export interface ReturnItemInput extends OrderItemInput {
  quantityRecovered: number;
}

export interface CostItem {
  kind: string;
  amount: number;
  referenceId?: string;
}

export interface MarginInput {
  revenue: number;
  items: OrderItemInput[];
  costs: CostItem[];
}

export interface OrderItemCogs {
  variantId: string;
  batchItemId: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
}

export interface MarginResult {
  revenue: number;
  cogs: number;
  totalCosts: number;
  grossMargin: number;
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
  cogsLoss: number;
  costsLoss: number;
  totalLoss: number;
}
