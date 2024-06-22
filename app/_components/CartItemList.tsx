"use client"
import { Button } from '@/components/ui/button';
import { Trash2Icon, TrashIcon } from 'lucide-react';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export interface list {
    name: string;
    quantity: number;
    amount: number;
    image: string;
    actualPrice: number;
    id: number;
}

export interface CardListProps{
    CartItemList:list[]
    onDeleteItem: (id: number) => void;
}

const CartItemList: React.FC<CardListProps> =({CartItemList,onDeleteItem})=> {
  
  return (
    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <div>
            {CartItemList.map((item,index)=>(

                <div className='flex justify-between items-center p-2 mb-3'>
                    <div className='flex gap-6 items-center'>
                    <Image className='border p-2' src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL+item.image} width={70} height={70} alt={item.name}/>
                <div>
                    <h2 className='text-lg text-orange-700'>{item.name}</h2>
                    <h2 className='text-lg text-purple-600'>Quantity:{item.quantity}</h2>
                    <h2 className='text-lg text-green-500'>Amount:${item.amount}</h2>
                </div>
                </div>
                <Trash2Icon className='text-purple-600 cursor-pointer' onClick={() => onDeleteItem(item.id)} />
      
                </div>
            )

            )}
        </div>
       
    </div>
  )
}

export default CartItemList