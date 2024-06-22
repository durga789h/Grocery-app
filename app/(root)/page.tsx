"use client"
import React, { useEffect, useState } from 'react';
import Slider from '../_components/Slider';
import GlobalApi from '../_utils/GlobalApi';
import CategoryList from '../_components/CategoryList';
import ProductList from '../_components/ProductList';
import Image from 'next/image';


export default function Home() {
    const [categoryList, setCategoryList] = useState([]);
    const [sliderList, setSliderList] = useState([]);
    const [productlist,setProductList]=useState([]);

    useEffect(() => {
        GlobalApi.getCategoryList()
            .then(category => setCategoryList(category))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    useEffect(() => {
        GlobalApi.getSliders()
            .then(sliders => setSliderList(sliders))
            .catch(error => console.error('Error fetching sliders:', error));
    }, []);

    useEffect(() => {
      GlobalApi.getAllProducts()
          .then(productlist => setProductList(productlist))
          .catch(error => console.error('Error fetching sliders:', error));
  }, []);



    return (
        <div className="p-7 md:p-10 px-16">
          
            <h1 className='text-white text-center bg-gradient-to-br from-red-600 to-green-500 rounded-xl p-2 mb-3 '>Fresh healthy Grocery</h1>
            <div className='p-5'>
            <Slider sliderList={sliderList} />
            </div>
            <CategoryList categoryList={categoryList}/>
            {/* productlist*/}
            <ProductList productlist={productlist}/>

            {/*Banner */}
            <div className='flex justify-center'>
            <Image src={"/banner.png"} width={1000} height={30} alt='banner' className='w-full object-contain'/>
            </div>
       
        </div>
    );
}
