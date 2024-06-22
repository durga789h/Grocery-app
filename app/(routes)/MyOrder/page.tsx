"use client"
import GlobalApi from '@/app/_utils/GlobalApi';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import MyOrderItem from './_components/MyOrderItem';


function MyOrder() {
  const jwt=sessionStorage.getItem("jwt");
  const user = sessionStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const router=useRouter();
  const[orderList,setOrderList]=useState([]);
  useEffect(()=>{
    if(!jwt){
      router.replace("/")
    };
    getMyOrder()
  },[])
  
  const getMyOrder=async()=>{
    const orderList_=await GlobalApi.getMyOrder(parsedUser.id,jwt);
    setOrderList(orderList_);
    console.log(orderList_);
  }

  return (
    <div>
      <h2 className='bg-green-700 text-xl font-bold text-center text-white p-3'>My Order</h2>
      <div className='py-8 px-4 md:px-20'>
        <h2 className='text-3xl font-bold text-green-700 mb-6'>Order History</h2>
        <div className='flex-1'>
          {orderList.map((item, index) => (
            <Collapsible key={index} className='mb-4'>
              <CollapsibleTrigger>
                <div className='border p-4 bg-slate-100 flex flex-col md:flex-row md:justify-evenly gap-4 md:gap-24 w-full'>
                  <h2><span className='font-bold mr-2'>Order Date:</span> {moment(item?.createdAt).format("DD/MMM/yyyy")}</h2>
                  <h2><span className='font-bold mr-2'>Total Amount:</span> ${item.totalOrderAmount}</h2>
                  <h2><span className='font-bold mr-2'>Status:</span>{item.status}</h2>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='border-t border-gray-200 p-4'>
                  {item.orderItemList.map((order:any,i:number)=>(
                    <MyOrderItem orderItem={order} key={i}/>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        <button className='bg-gradient-to-br from-fuchsia-800 cursor-pointer text-white to-pink-600 p-3 rounded-full w-full'
        onClick={()=>router.push("/")}> Go to Home</button>
      </div>
    </div>
  )
}

export default MyOrder;
