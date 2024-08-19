// src/useModelData.js
import { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

const useModelData = () => {
  const [modelData, setModelData] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, 'products'); // Querying the 'products' node
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const products = snapshot.val();
      console.log('Products snapshot:', snapshot); // Debugging line
      if (products) {
        const allModels = [];

        // Iterate over each product node
        Object.keys(products).forEach((productId) => {
          const product = products[productId];
          if (product.modelImagePairs) {
            // Iterate over modelImagePairs for each product
            Object.keys(product.modelImagePairs).forEach((key) => {
              allModels.push(product.modelImagePairs[key]);
            });
          }
        });

        setModelData(allModels);
      } else {
        setModelData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return modelData;
};

export default useModelData;
