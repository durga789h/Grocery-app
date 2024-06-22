import React from 'react';
import ProductItem from './ProductItem';

export interface Product {
  id: number;
  attributes: {
    name: string;
    description: string;
    mrp: number;
    sellingPrice: number;
    itemQuantityType: string;
    images: {
      data: {
        id: number;
        attributes: {
          url: string;
        };
      }[];
    };
    categories: {
      data: {
        id: number;
        attributes: {
          name: string;
          color: string | null; // Optional: If you have color information for categories
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        };
      }[];
    };
  };
}




interface ProductListProps {
  productlist: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ productlist }) => {
  return (
    <div className='mt-2'>
      <h2 className='text-lime-700 font-bold text-2xl'>Our Popular Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {productlist.map(product => (
          <ProductItem key={product.id} product={product}/>
        ))}
      </div>
      
    </div>
  );
}

export default ProductList;

//()product,index)=>index<8&&(

//)