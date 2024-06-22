import GlobalApi from '@/app/_utils/GlobalApi';
import React from 'react';
import TopCategoryList from '../../_components/TopCategoryList';
import ProductList from '@/app/_components/ProductList';

interface ProductItemParams {
  categoryName: string;
}

interface ProductCategoryProps {
  params: ProductItemParams;
}

async function ProductCategory({ params }: ProductCategoryProps) {
    const productList=await GlobalApi.getProductsByCategory(params.categoryName)
    const categoryList=await GlobalApi.getCategoryList()
  return (
    <div className='mt-6'>
      
    <h2 className='p-4 bg-blue-600 text-white font-bold text-3xl text-center'>{params.categoryName} </h2>
    <TopCategoryList categoryList={categoryList} selectedCategory={params.categoryName}/>
    <div className='p-5 md:p-10'>
    <ProductList productlist={productList}/>
    </div>
    </div>
  );
}

export default ProductCategory;
