import { ReturnLossInput, DamageLossInput, LossResult } from './finance.types';

export function calculateReturnLoss(input: ReturnLossInput): LossResult {
  const cogsLoss = input.items.reduce(
    (sum, item) => sum + (item.quantity - item.quantityRecovered) * item.unitCost,
    0,
  );
  const costsLoss = input.costs.reduce((sum, cost) => sum + cost.amount, 0);
  return { cogsLoss, costsLoss, totalLoss: cogsLoss + costsLoss };
}

export function calculateDamageLoss(input: DamageLossInput): LossResult {
  const cogsLoss = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0,
  );
  const costsLoss = input.costs.reduce((sum, cost) => sum + cost.amount, 0);
  return { cogsLoss, costsLoss, totalLoss: cogsLoss + costsLoss };
}
