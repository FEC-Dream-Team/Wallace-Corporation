import React from 'react';

const Size = (props) => {
  // Import all possible sizes of a product
  // Import cart data to check count, if count = 0 disable button and label "OUT OF STOCK"
  // Map over sizes and place in an option
  const { stylesArr } = props;

  // props.whateverArrayIndex.skus.${sku_id}.size

  return <option>S</option>;
};

export default Size;
