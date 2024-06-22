"use client"
import { Button } from '@/components/ui/button'
import { CircleUserRound, LayoutGrid, Search, ShoppingBasket } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
import GlobalApi from '../_utils/GlobalApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UpdateCartContext } from '../_context/UpdateCartContex';
import CartItemList, { CardListProps } from './CartItemList';
import { toast } from 'sonner';

// _utils/Types.ts

interface Category {
  id: number;
  attributes: {
    name: string;
    color: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    icon: {
      data: {
        id: number;
        attributes: {
          name: string;
          alternativeText: string | null;
          caption: string | null;
          width: number;
          height: number;
          formats: any; // You can define a type/interface for this if needed
          hash: string;
          ext: string;
          mime: string;
          size: number;
          url: string;
          previewUrl: string | null;
          provider: string;
          provider_metadata: any | null; // You can define a type/interface for this if needed
          createdAt: string;
          updatedAt: string;
        };
      }[];
    };
  };
}

const Header=()=> {
  const Router=useRouter();
  const isLogin=sessionStorage.getItem('jwt')?true:false
  const jwt = sessionStorage.getItem("jwt") ?? "";
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext)!;
  const[cartItemList,setCartItemList]=useState<CardListProps['CartItemList']>([]);
  const user = sessionStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const[totalCartItem,setTotalCartItem]=useState(0)
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [subtotal,setSubtotal]=useState(0);


  useEffect(()=>{
    getCategoryList()
  },[])

  useEffect(()=>{
    if (parsedUser) {
      getCartItems();
    }
  },[updateCart])

  const getCategoryList=()=>{
    GlobalApi.getCategory().then(Response =>{
      setCategoryList(Response.data.data)
    })
    .catch(error => {
      console.error("Error fetching category list:", error);
    });
  }

  const getCartItems=async()=>{
    if (!parsedUser) {
      Router.push("/sign-in");
      return;
    }
    const cartItemList_=await GlobalApi.getCartItems(parsedUser.id,jwt)
    console.log(cartItemList_)
    setTotalCartItem(cartItemList_?.length)
    setCartItemList(cartItemList_)
  }

  const onSignOut=() =>{
    sessionStorage.clear();
    Router.push("/sign-in");
  }

  const onDeleteItem=(id:number)=>{
    GlobalApi.deleteCartItem(id,jwt).then(resp=>{
      toast("Item removed !");
      getCartItems();//call after delete so it refreshes the data after delete
      console.log(resp)
    })
  }

  useEffect(() => {
    let total = 0;
    cartItemList.forEach(element => {
      total = total + element.amount;
    });
    setSubtotal(total);
  }, [cartItemList]);

  return (
   <header className='p-0 shadow-md'> 
    <div className='flex items-center justify-between mr-5'>
    <Image src={"/grocery-store.jpg"} width={110} height={40} alt='img'/>
      
        <DropdownMenu>
  <DropdownMenuTrigger>
  <h2 className='hidden md:flex gap-2 mr-2 items-center border rounded-full p-2 bg-slate-300 px-14 cursor-pointer'><LayoutGrid className='h-5 w-5'/>Category</h2>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {categoryList.map((category, i) => (
      <Link href={"/products-category/"+category.attributes.name} key={i}>
  <DropdownMenuItem  className='flex gap-4 items-center cursor-pointer'>
    {category.attributes.icon?.data.map((item, j) => (

      <Image
        key={j}
        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + item.attributes.url}
        unoptimized={true}
        width={30}
        height={30}
        alt='img'
      />
    ))}
    <h2 className='text-lg'>{category.attributes.name}</h2>
  </DropdownMenuItem>
  </Link>
))}

   
  </DropdownMenuContent>
</DropdownMenu>


        <div className='md:flex gap-4 items-center border rounded-full p-2 px-5 hidden'>
            <Search/>
            <input type="text" placeholder='search' className='outline-none '/>
        </div>
        <div className='flex gap-5'>
          
            
             <Sheet>
  <SheetTrigger><h2 className='flex gap-2 items-center text-lg'>  <ShoppingBasket className='h-7 w-7'/>
             <span className='bg-lime-500 text-white p-1 px-2 rounded-full'>{totalCartItem}</span></h2></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle className='bg-orange-500 p-2 text-white text-lg'>MY Cart</SheetTitle>
      <SheetDescription>
      <CartItemList CartItemList={cartItemList} onDeleteItem={onDeleteItem}/>
      </SheetDescription>
    </SheetHeader>
    <SheetClose asChild>
    <div className='absolute w-[90%] bottom-0 flex flex-col'>
            <h2 className='text-red-500 text-lg flex justify-between'>Subtotal <span className='mr-8'>${subtotal.toFixed(2)}</span></h2>
            <Button onClick={()=>Router.push(jwt?"/checkout":"/sign-in")}>Checkout</Button>
        </div>
    </SheetClose>
  </SheetContent>
</Sheet>


         {!isLogin ?<Link href={"/sign-in"}>
            <Button className='bg-gradient-to-tr from-purple-700 to-pink-600 p-3 rounded-full' >Login</Button>
            </Link>:
             <DropdownMenu>
  <DropdownMenuTrigger >
  <CircleUserRound className=' 
             border-green-600 bg-green-200 cursor-pointer p-2 rounded-full text-green-500 h-12 w-12'/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={()=>Router.push("/Profile")}>Profile</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>Router.push("/MyOrder")}>My Order</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>onSignOut()}>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

             }

        </div>
    </div>
   </header>
  )
}

export default Header;
