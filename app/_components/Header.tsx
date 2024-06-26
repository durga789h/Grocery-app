"use client";
import { Button } from '@/components/ui/button';
import { CircleUserRound, LayoutGrid, Search, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import GlobalApi from '../_utils/GlobalApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UpdateCartContext } from '../_context/UpdateCartContex';
import CartItemList, { CardListProps } from './CartItemList';
import { toast } from 'sonner';

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
                    formats: any;
                    hash: string;
                    ext: string;
                    mime: string;
                    size: number;
                    url: string;
                    previewUrl: string | null;
                    provider: string;
                    provider_metadata: any | null;
                    createdAt: string;
                    updatedAt: string;
                };
            }[];
        };
    };
}

const Header = () => {
    const router = useRouter();
    const { updateCart } = useContext(UpdateCartContext)!;
    const [isLogin, setIsLogin] = useState(false);
    const [cartItemList, setCartItemList] = useState<CardListProps['CartItemList']>([]);
    const [totalCartItem, setTotalCartItem] = useState(0);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [jwt, setJwt] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const storedJwt = sessionStorage.getItem('jwt');
        const storedUser = sessionStorage.getItem('user');
        setJwt(storedJwt);
        setUser(storedUser);
        setIsLogin(!!storedJwt);
        getCategoryList();
    }, []);

    useEffect(() => {
        if (user) {
            getCartItems();
        }
    }, [updateCart, user]);

    const getCategoryList = useCallback(async () => {
        try {
            const response = await GlobalApi.getCategory();
            setCategoryList(response.data.data);
        } catch (error) {
            console.error("Error fetching category list:", error);
        }
    }, []);

    const getCartItems = useCallback(async () => {
        if (!user) {
            router.push("/sign-in");
            return;
        }
        try {
            const parsedUser = JSON.parse(user);
            const cartItemList_ = await GlobalApi.getCartItems(parsedUser.id, jwt);
            setTotalCartItem(cartItemList_.length);
            setCartItemList(cartItemList_);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }, [user, jwt, router]);

    const onSignOut = useCallback(() => {
        sessionStorage.clear();
        router.push("/sign-in");
    }, [router]);

    const onDeleteItem = useCallback(async (id: number) => {
        try {
            await GlobalApi.deleteCartItem(id, jwt);
            toast("Item removed!");
            getCartItems();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }, [getCartItems, jwt]);

    useEffect(() => {
        const total = cartItemList.reduce((sum, item) => sum + item.amount, 0);
        setSubtotal(total);
    }, [cartItemList]);

    return (
        <header className='p-0 shadow-md'>
            <div className='flex items-center justify-between mr-5'>
                <Image src={"/grocery-store.jpg"} width={110} height={40} alt='img' />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <h2 className='hidden md:flex gap-2 mr-2 items-center border rounded-full p-2 bg-slate-300 px-14 cursor-pointer'>
                            <LayoutGrid className='h-5 w-5' />Category
                        </h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categoryList.map((category, i) => (
                            <Link href={"/products-category/" + category.attributes.name} key={i}>
                                <DropdownMenuItem className='flex gap-4 items-center cursor-pointer'>
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
                    <Search />
                    <input type="text" placeholder='search' className='outline-none ' />
                </div>
                <div className='flex gap-5'>
                    <Sheet>
                        <SheetTrigger>
                            <h2 className='flex gap-2 items-center text-lg'>
                                <ShoppingBasket className='h-7 w-7' />
                                <span className='bg-lime-500 text-white p-1 px-2 rounded-full'>{totalCartItem}</span>
                            </h2>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle className='bg-orange-500 p-2 text-white text-lg'>MY Cart</SheetTitle>
                                <SheetDescription>
                                    <CartItemList CartItemList={cartItemList} onDeleteItem={onDeleteItem} />
                                </SheetDescription>
                            </SheetHeader>
                            <SheetClose asChild>
                                <div className='absolute w-[90%] bottom-0 flex flex-col'>
                                    <h2 className='text-red-500 text-lg flex justify-between'>Subtotal <span className='mr-8'>${subtotal.toFixed(2)}</span></h2>
                                    <Button onClick={() => router.push(isLogin ? "/checkout" : "/sign-in")}>Checkout</Button>
                                </div>
                            </SheetClose>
                        </SheetContent>
                    </Sheet>
                    {!isLogin ? (
                        <Link href={"/sign-in"}>
                            <Button className='bg-gradient-to-tr from-purple-700 to-pink-600 p-3 rounded-full'>Login</Button>
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <CircleUserRound className='border-green-600 bg-green-200 cursor-pointer p-2 rounded-full text-green-500 h-12 w-12' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/Profile")}>Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/MyOrder")}>My Order</DropdownMenuItem>
                                <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
