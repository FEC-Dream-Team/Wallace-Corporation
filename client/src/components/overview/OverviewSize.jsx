import React, { useState, useEffect } from 'react';
import OverviewQuantity from './OverviewQuantity';

const OverviewSize = (props) => {
  // Import all possible sizes of a product
  // Import cart data to check count, if count = 0 disable button and label "OUT OF STOCK"
  // Map over sizes and place in an option

  const { sizesAndQuantities } = props;

  const [defaultString, setDefaultString] = useState('Select Size');
  const [currentSize, setCurrentSize] = useState('');
  const [currentQuantityAvailable, setCurrentQuantityAvailable] = useState(0);

  // useEffect(() => {
  //   setDefaultString('Select Size');
  //   return (
  //     <select>
  //       {defaultString}
  //     </select>
  //   );
  // }, []);

  const selectedSizeHandler = (event) => {
    event.preventDefault();

    for (let i = 0; i < sizesAndQuantities.length; i++) {
      if (event.target.value === sizesAndQuantities[i].size) {
        setCurrentQuantityAvailable(sizesAndQuantities[i].quantity);
      }
    }

    setCurrentSize(event.target.value);
  };

  const sizeOptions = sizesAndQuantities.map((productSize, index) => (
    <option key={index}>{productSize.size}</option>
  ));

  // if (currentSize === '') {
  //   return (
  //     <select onChange={selectedSizeHandler}>
  //       {defaultString}
  //     </select>
  //   );
  // }

  // Line 57 is how to disable a button
  // function App() {

  //   const [name, setName] = useState('');
  //   const nameChange = e => setName(e.target.value);

  //   return (
  //     <div className="App">
  //       <input value={name} onChange={nameChange} placeholder="Name"/>
  //       <button disabled={!name}>Search</button>
  //     </div>
  //   );
  // }

  return (
    <div>
      <select onChange={selectedSizeHandler}>
        {sizeOptions}
      </select>
      <div>
        <OverviewQuantity quantityForSize={currentQuantityAvailable} />
      </div>
    </div>
  );
};

export default OverviewSize;
