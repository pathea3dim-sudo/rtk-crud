// 'use client'
// import { useGetAllProductQuery } from "@/services/ecommerce"

// export default function ProductList() {
//   const {data:products, error, isLoading} = useGetAllProductQuery();
//   console.log(`check error status: ${error}`);
//   console.log(`Loading: ${isLoading}`);
//   console.log(`All Products:`, products);
//   return (
//     <div>
//       {
//         products?.content.map((pro, index) => (
//            <h1 key={index}>{pro?.name}</h1>
//         ))
//       }
//     </div>
//   )
// }





"use client";

import { useGetAllProductQuery } from "@/services/ecommerce";

export function ProductList() {
  const { data, isLoading, error } = useGetAllProductQuery({ page: 1, size: 10 });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products</div>;
  }

  return (
    <div>
      <h2>Products</h2>
      {data?.content?.map((product) => (
        <div key={product.uuid}>
          <h3>{product.name}</h3>
          <p>Price: ${product.priceOut}</p>
        </div>
      ))}
    </div>
  );
}
