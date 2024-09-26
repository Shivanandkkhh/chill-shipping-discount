/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const fixedShippingDiscount = 4.99;

  if (!input.cart || !input.cart.deliveryGroups || input.cart.deliveryGroups.length === 0) {
    return EMPTY_DISCOUNT;
  }

  const deliveryOptions = [];
  let totalShippingAmount = 0;
  let deliveryGroupLengh = 0;

  for (const deliveryGroup of input.cart.deliveryGroups) {
    deliveryGroupLengh++;
    for (const option of deliveryGroup.deliveryOptions) {
      const shippingAmount = parseFloat(option.cost.amount);
      totalShippingAmount += shippingAmount;
      deliveryOptions.push({
        deliveryOption: {
          handle: option.handle,
        },
      });
    }
  }

  const shippingCharge = totalShippingAmount - fixedShippingDiscount;
  const appliedShippingCharge = (totalShippingAmount - shippingCharge) / deliveryGroupLengh;
  const cartTotalCost = input.cart.cost.totalAmount.amount;


  let discount;

  if(cartTotalCost < 75){
     discount = {
      value: {
        fixedAmount: {
          amount: appliedShippingCharge,
        },
      },
      targets: deliveryOptions
    };  
  }
  else{
     discount = {
      value: {
        percentage: {
          value: 100,
        },
      },
      targets: deliveryOptions,
      message: `Free shipping`,
    }; 
  }

  return {
    discounts: [discount],
  };
}