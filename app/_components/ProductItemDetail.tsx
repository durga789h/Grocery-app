 "use client"
import React, { useContext, useState } from 'react'

import { Product } from './ProductList';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LoaderCircle, ShoppingBasket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlobalApi from '../_utils/GlobalApi';
import { toast } from 'sonner';
import { UpdateCartContext } from '../_context/UpdateCartContex';

interface ProductItemProps {
    product: Product;
  }
 export interface CardData {
    quantity: number;
    amount: string;
    products: number;
    user_permissions_users: any;
}

// Create requestData with the specified type


function ProductItemDetail({product}:any) {
  const jwt=sessionStorage.getItem("jwt");
  const user = sessionStorage.getItem("user");
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext)! as { updateCart: boolean; setUpdateCart: (value: boolean) => void };

const parsedUser = user ? JSON.parse(user) : null;
    const[productTotalPrice,setProductTotalPrice]=useState(
        product.attributes.sellingPrice?
        product.attributes.sellingPrice:
        product.attributes.mrp
    )
    const router=useRouter();
    const[quantity,setQuantity]=useState(1);

    const[loading,setLoading]=useState(false)
    const addToCard = () => {
      setLoading(true)
      if (!jwt) {
        router.push("/sign-in");
        setLoading(false)
        return;
      }
    
      const carddata = {
       data:{
            quantity: quantity,
            amount: (quantity * productTotalPrice).toFixed(2),
            products: product.id,
            user_permissions_users: parsedUser ? parsedUser.id : null,
            userId: parsedUser ? parsedUser.id : null 
       }
    };
    //console.log(requestData)
    
    
    GlobalApi.addToCard(carddata, jwt).then(resp => {
      console.log(resp);
      toast("Added to cart");
      setUpdateCart(!updateCart);
      setLoading(false)
    }).catch(error => {
      console.error("Error adding to cart:", error);
      toast("Failed to add to cart");
      setLoading(false)
    });
  
    }
    
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black'>
        <Image className='p-5 h-[320px] w-[300px] object-contain rounded-lg'
         src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL +product.attributes.images.data[0].attributes.url} width={300} height={300} alt='img'/>
         <div className='flex flex-col gap-3'>
            <h2 className='text-2xl font-bold text-red-600'>{product.attributes.name}</h2>
            <h2 className='text-xl text-amber-600'>{product.attributes.description}</h2>

            <p className='text-orange-700 text-xl'>MRP: ${product.attributes.mrp}</p>
        <p className='text-green-600 text-xl'>Selling Price: ${quantity*productTotalPrice}</p>
        <p className='text-yellow-800'>Quantity: {product.attributes.itemQuantityType}</p>

        <div className='flex flex-col items-center gap-3'>
            <div className='flex gap-2 items-center'>
            <div className='p-2 border flex gap-10 items-center px-3'>
                <Button className='bg-green-400' disabled={quantity==1} onClick={()=>setQuantity(  quantity-1 )}>-</Button>
                <h2>{quantity}</h2>
                <Button className='bg-green-500' onClick={()=>setQuantity(quantity+1)}>+</Button>
            </div>
            <h2 className='text-2xl font-bold text-amber-700'>=${(quantity*productTotalPrice).toFixed(2)}</h2>
            </div>
            <Button className='mt-3 flex gap-3 bg-gradient-to-br from-blue-700 to-purple-900 p-3 rounded-lg' onClick={()=>addToCard()} disabled={loading}>
                <ShoppingBasket/>
              {loading?<LoaderCircle className='animate-spin'/>:" Add to card"} 
            </Button>
         </div>
         
         <h2 className='text-red-600 text-xl'><span>Category:</span>{product.attributes?.categories.data.attributes?.name}</h2>


         </div>

        
    </div>
  )
}

export default ProductItemDetail