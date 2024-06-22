import React from 'react';
import { OrderItemData } from '@/app/_utils/GlobalApi';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    orderItem: OrderItemData;
}

export default function MyOrderItem({ orderItem }: Props) {
   
    return (
        <>
        <div className='flex gap-9 items-center w-[100%] mt-3'>
        {/* Rendering the image */}
        <Image  src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL +orderItem.product.data.attributes.images.data[0].attributes.url } width={125} height={50} alt='order-image' className='bg-gray-200 p-5 rounded-md border mb-3' />
        {orderItem.product.data.attributes.mrp}
       <div className='col-span-2'>
        <h2>{orderItem.product.data.attributes.name}</h2>
        <h2>ItemPrice:-{orderItem.amount}</h2>
        
       </div>
       <h2>Quantity:{orderItem.quantity}</h2>
       <h2>Price:-{orderItem.amount}</h2>
      
    </div>
    <Link href="/" className="bg-gradient-to-br from-red-600 to-orange-600 p-3 rounded-md text-white float-right">Go to home</Link>
    <hr />
    </>

    );
}
