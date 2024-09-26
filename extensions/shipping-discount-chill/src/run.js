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
  // Define the fixed shipping discount amount
  const fixedShippingDiscount = 4.99;

  console.error('fixedShippingDiscount', fixedShippingDiscount);

  // Check if the cart and delivery groups are defined
  if (!input.cart || !input.cart.deliveryGroups || input.cart.deliveryGroups.length === 0) {
    return EMPTY_DISCOUNT;
  }

  const deliveryOptions = [];

  // Loop through all delivery groups and delivery options
  for (const deliveryGroup of input.cart.deliveryGroups) {
    for (const option of deliveryGroup.deliveryOptions) {
      deliveryOptions.push({
        deliveryOption: {
          handle: option.handle,
        },
      });
    }
  }

  // Create a discount for all delivery options with a fixed discount of $4.99
  const discount = {
    value: {
      fixedAmount: {
        amount: fixedShippingDiscount,
      },
    },
    targets: deliveryOptions, // Apply discount to all delivery options
    message: "$4.99 off shipping",
  };

  console.error('discount', discount);

  return {
    discounts: [discount], // Apply discount to all options
  };
}
