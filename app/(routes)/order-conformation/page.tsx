"use client"
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function OrderConfirmation() {
  const Router=useRouter();
  return (
    <div className='flex justify-center my-20'>
      <div className='border shadow-md flex flex-col justify-center p-20 rounded-md
      items-center gap-3 px-32'>
        <CheckCircle2 className='h-24 w-24 text-green-700'/>
        <h2 className='font-medium text-3xl text-green-700'>Order successfully</h2>
        <h2>Thank you so much for order</h2>
        <Button className='mt-8 bg-green-600' onClick={()=>Router.push("/MyOrder")}> Track your order</Button>
      </div>
    </div>
  )
}
