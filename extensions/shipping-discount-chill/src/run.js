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
  let deliveryGroupLength = parseInt(input.cart.deliveryGroups.length);

  for (const deliveryGroup of input.cart.deliveryGroups) {
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
  let appliedShippingCharge = (totalShippingAmount - shippingCharge) / deliveryGroupLength;
  const cartTotalCost = parseFloat(input.cart.cost.totalAmount.amount);
  
  if(deliveryGroupLength <= 1){
    appliedShippingCharge = 0;
  }

  console.error('deliveryGroupLength', deliveryGroupLength);
  console.error('totalShippingAmount', totalShippingAmount);
  console.error('appliedShippingCharge', appliedShippingCharge);
  console.error('cartTotalCost', cartTotalCost);


  let discount;

  if (cartTotalCost < 1000) {
    discount = {
      value: {
        fixedAmount: {
          amount: appliedShippingCharge.toFixed(2), // Ensure correct decimal formatting
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