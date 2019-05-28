import config from './config';
import { DEFAULT_RATE_MULTIPLIER } from '../defaults';

export default function(
  rate,
  sourceCurrency,
  targetCurrency,
  { reference = 'auto', referenceMultiplier = null } = {},
) {
  validateParameters();

  let equation = {
    lhsCurrency: sourceCurrency,
    lhsValue: 1,
    rhsCurrency: targetCurrency,
    rhsValue: rate,
  };

  if (shouldInvertEquation()) {
    equation = invertEquation();
  }
  return multiplyEquation(getMultiplier());

  function validateParameters() {
    if (!rate || !sourceCurrency || !targetCurrency) {
      throw new Error('Parameters rate, sourceCurrency and targetCurrency are mandatory');
    }
    if (reference && ['auto', 'source', 'target'].indexOf(reference) === -1) {
      throw new Error('Invalid reference value received. Valid values are auto, source, target');
    }
    if (referenceMultiplier && typeof referenceMultiplier !== 'number') {
      throw new Error('referenceMultiplier must be a number');
    }
  }

  function shouldInvertEquation() {
    return (
      reference === 'target' ||
      (reference !== 'source' &&
        config[equation.lhsCurrency] &&
        config[equation.lhsCurrency].hasInversionEnabled)
    );
  }

  function invertEquation() {
    return {
      ...equation,
      lhsCurrency: equation.rhsCurrency,
      rhsCurrency: equation.lhsCurrency,
      rhsValue: 1 / equation.rhsValue,
    };
  }

  function getMultiplier() {
    if (referenceMultiplier) {
      return referenceMultiplier;
    }

    if (config[equation.lhsCurrency] && config[equation.lhsCurrency].multiplierForEquation) {
      return config[equation.lhsCurrency].multiplierForEquation;
    }
    return DEFAULT_RATE_MULTIPLIER;
  }

  function multiplyEquation(multiplier) {
    return {
      ...equation,
      lhsValue: equation.lhsValue * multiplier,
      rhsValue: equation.rhsValue * multiplier,
    };
  }
}
