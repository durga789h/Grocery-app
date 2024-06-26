"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowBigRight } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadScript(src: any) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const Checkout = () => {
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [cartItemList, setCartItemList] = useState([]);
  const [username, setUserName] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    address: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [jwt, setJwt] = useState<string | null>(null);
  const [parsedUser, setParsedUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if window is defined before accessing sessionStorage
    if (typeof window !== 'undefined') {
      const jwtToken = sessionStorage.getItem("jwt");
      const user = sessionStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;

      if (!jwtToken) {
        router.push("/sign-in");
      } else {
        setJwt(jwtToken);
        setParsedUser(parsedUser);
        if (parsedUser) {
          getCartItems(parsedUser.id, jwtToken);
        }
      }
    }
  }, [router]);

  useEffect(() => {
    let total = 0;
    cartItemList.forEach(element => {
      total += element.amount;
    });
    setSubtotal(total);
  }, [cartItemList]);

  useEffect(() => {
    const totalAmount = (subtotal * 9) / 100 + 15 + subtotal;
    setTotalAmount(Number(totalAmount.toFixed(2)));
  }, [subtotal]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value = event.target.value;
    setUserName({ ...username, [name]: value });
  };

  const getCartItems = async (userId: number, jwtToken: string) => {
    try {
      const cartItems = await GlobalApi.getCartItems(userId, jwtToken);
      setTotalCartItem(cartItems.length);
      setCartItemList(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const calculateTotalAmount = () => {
    const totalAmount = (subtotal * 9) / 100 + 15 + subtotal;
    return totalAmount.toFixed(2);
  };

  const createOrderId = async () => {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          name: username.name,
          email: username.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.orderId; // Extract orderId from the response
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const processPayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      toast("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    try {
      const orderId = await createOrderId();
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: username.name,
        description: 'description',
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const datacard = {
            data: {
              username: username.name,
              email: username.email,
              phone: username.phone,
              zip: username.zip,
              address: username.address,
              totalOrderAmount: totalAmount,
              userId: parsedUser.id,
              paymentId: orderId,
              orderItemList: cartItemList,
            }
          };

          try {
            const create = await GlobalApi.createOrder(datacard, jwt);
            console.log(create);
            toast("Order placed successfully");

            // Iterate over cart items and delete each one
            cartItemList.forEach((item: any) => {
              GlobalApi.deleteCartItem(item.id, jwt).then(resp => {
                // Handle successful deletion if needed
              }).catch(error => {
                console.error("Error deleting cart item:", error);
                // Handle the error here, such as displaying an error message to the user
              });
            });

            router.replace("/order-conformation");
          } catch (error) {
            console.error("Error creating order:", error);
            // Handle the error here, such as displaying an error message to the user
          }

          const result = await fetch('/api/verify', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
          });
          const res = await result.json();
          if (res.isOk) toast("Payment succeeded");
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: username.name,
          email: username.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='p-2'>
      <h2 className='p-3 bg-lime-600 text-xl font-bold text-center text-white'>Checkout</h2>
      <div className='p-5 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 py-8'>
        <div className='md:col-span-2 mx-20 mb-5'>
          <h2>Billing Details</h2>
          <div className='grid md:grid-cols-2 gap-10 mt-3'>
            <Input placeholder="Name" name="name" onChange={handleChange} />
            <Input placeholder="Email" name="email" onChange={handleChange} />
          </div>
          <div className='grid grid-cols-2 gap-10 mt-3'>
            <Input placeholder="Phone" name="phone" onChange={handleChange} />
            <Input placeholder="Zip" name="zip" onChange={handleChange} />
          </div>
          <div className='mt-3'>
            <Input placeholder='Address' name="address" onChange={handleChange} />
          </div>
        </div>
        <div className='mx-10 border'>
          <h2 className='p-3 bg-gray-200 font-bold text-center'>Total Cart {totalCartItem}</h2>
          <div className='p-4 flex flex-col gap-4'>
            <h2 className='font-bold flex justify-between'>Subtotal:<span>${subtotal}</span></h2>
            <hr />
            <h2 className='flex justify-between'>Delivery:<span>$15.00</span></h2>
            <h2 className='flex justify-between'>Tax(9%):<span>${((subtotal * 9) / 100).toFixed(2)}</span></h2>
            <hr />
            <h2 className='font-bold flex justify-between'>Total:<span>${calculateTotalAmount()}</span></h2>
            <Button type='submit' onClick={processPayment}>Payment <ArrowBigRight /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
