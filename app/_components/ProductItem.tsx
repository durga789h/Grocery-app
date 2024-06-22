import Image from 'next/image';
import React from 'react';
import { Product } from './ProductList'; 
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import ProductItemDetail from './ProductItemDetail';
  

interface ProductItemProps {
  product: Product;
}

function ProductItem({ product }: ProductItemProps) {
  return (
    <div key={product.id} className='mt-2 p-2 hover:scale-110 hover:shadow-md transition-all ease-in-out
     md:p-6 flex flex-col items-center justify-center gap-3 border rounded-lg cursor-pointer'>
      
        <h3 className="font-bold text-lg text-red-700">{product.attributes.name}</h3>
      {/*<p className='text-purple-600'>{product.attributes.description}</p>*/}
        <p className='text-orange-700'>MRP: ${product.attributes.mrp}</p>
        <p className='text-green-600'>Selling Price: ${product.attributes.sellingPrice}</p>
        <p className='text-yellow-800'>Quantity: {product.attributes.itemQuantityType}</p>
        
        <div className="flex justify-center">
          <Image
            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product.attributes.images.data[0].attributes.url}
            unoptimized={true}
            width={600}
            height={300}
            alt='img'
            className='h-[250px] w-[250px] object-contain'
          />
        </div>

      

        <Dialog>
  <DialogTrigger asChild>
  <Button className='p-2 rounded-md bg-orange-600 hover:bg-gradient-to-tr from-purple-700 to-red-800'>
          Add to Cart
        </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
    
      <DialogDescription>
        <ProductItemDetail product={product}/>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

      
    </div>
  );
}

export default ProductItem;
