"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function CreateAccount() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router=useRouter();
    const[loader,setLoader]=useState(false);

    const [usernameChanged, setUsernameChanged] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setUsernameChanged(true);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailChanged(true);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordChanged(true);
    }

    const onCreateAccount=()=>{
        setLoader(true)
        GlobalApi.registerUser(username,email,password).then(resp=>{
           // console.log(resp.data.user);
          //  console.log('User token', resp.data.jwt);
       sessionStorage.setItem("user",JSON.stringify(resp.data.user))
       sessionStorage.setItem("jwt",resp.data.jwt);
       router.push("/");
          toast("Account Created Successfully")
          setLoader(false)
        },(e)=>{
            toast(e?.response?.data?.error?.message);
            setLoader(false)
        })
    }

    useEffect(()=>{
        const jwt=sessionStorage.getItem('jwt');
        if(jwt){
            router.push("/")
        }
    },[])

    return (
        <div className='flex items-baseline justify-center my-10 mt-7'>
            <div className='flex flex-col items-center justify-center p-14 bg-slate-200 border border-gray-200'>
                <Image src="/grocery-store.jpg" width={200} height={60} alt='grocery' />
                <h2 className='text-3xl font-bold'>Create an Account</h2>
                <h2 className='text-gray-500'>Enter your Email and Password to Create an Account</h2>

                <div className='w-full flex flex-col gap-5 mt-10'>
                    <Input placeholder='Username' onChange={handleUsernameChange} className={usernameChanged && !username ? 'border-red-500' : ''} />
                    <Input placeholder='name@example.com' onChange={handleEmailChange} className={emailChanged && !email ? 'border-red-500' : ''} />
                    <Input type='password' placeholder='Password' onChange={handlePasswordChange} className={passwordChanged && !password ? 'border-red-500' : ''} />
                    <Button disabled={!(username||email||password)} onClick={()=>onCreateAccount()} className='bg-green-600 p-3 rounded-md'> 
                    {loader?<LoaderIcon className='animate-spin'/>:"Create AN Account"}
                    </Button>
                    <li>Already have an account
                        <Link href={"/sign-in"} className='text-blue-500'>Click here to sign In</Link>
                    </li>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount;
