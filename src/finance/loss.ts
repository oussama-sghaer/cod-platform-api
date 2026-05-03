import { Decimal } from 'decimal.js';
import { ReturnLossInput, DamageLossInput, LossResult } from './finance.types';

export function calculateReturnLoss(input: ReturnLossInput): LossResult {
  const cogsLoss = input.items.reduce(
    (sum, item) =>
      sum.plus(item.unitCost.times(item.quantity - item.quantityRecovered)),
    new Decimal(0),
  );
  const costsLoss = input.costs.reduce(
    (sum, cost) => sum.plus(cost.amount),
    new Decimal(0),
  );
  return { cogsLoss, costsLoss, totalLoss: cogsLoss.plus(costsLoss) };
}

export function calculateDamageLoss(input: DamageLossInput): LossResult {
  const cogsLoss = input.items.reduce(
    (sum, item) => sum.plus(item.unitCost.times(item.quantity)),
    new Decimal(0),
  );
  const costsLoss = input.costs.reduce(
    (sum, cost) => sum.plus(cost.amount),
    new Decimal(0),
  );
  return { cogsLoss, costsLoss, totalLoss: cogsLoss.plus(costsLoss) };
}
