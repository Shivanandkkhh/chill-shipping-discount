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
  let totalShippingAmount = 0;
  const cartTotalCost = parseFloat(input.cart.cost.subtotalAmount.amount);

  
 const threshold = 1000;
 const deliveryOptions = [];
 const deliveryOptionsWithAmount = [];
 for (const deliveryGroup of input.cart.deliveryGroups) {
  for (const option of deliveryGroup.deliveryOptions) {
    const shippingAmount = parseFloat(option.cost.amount);
    totalShippingAmount += shippingAmount; 
    deliveryOptions.push({
      deliveryOption: {
        handle: option.handle
      },
    });
    deliveryOptionsWithAmount.push({
      deliveryOption: {
        handle: option.handle,
        amount: shippingAmount
      },
    });
  }
}

console.error('totalShippingAmount', totalShippingAmount);
console.error('cartTotalCost', cartTotalCost);
console.error('thresoldh', threshold);
const individualPrice = deliveryOptionsWithAmount[0].deliveryOption.amount;
let applicableDiscountPercentage;
if(individualPrice > fixedShippingDiscount) {
   applicableDiscountPercentage = 100 - ((100 / individualPrice) * fixedShippingDiscount);
 
}
console.log(individualPrice, "individual Price")

console.error(applicableDiscountPercentage,'applicableDiscountPercentage');

let discount;
  if (threshold > cartTotalCost) {
    discount = { 
      value: {
        percentage: { 
          value: applicableDiscountPercentage,
        },
      },
      targets: deliveryOptions,
      message: `Flat rate`,
    };  
  }
  
  if(cartTotalCost > threshold){
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