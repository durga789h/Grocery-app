import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
        <h2 className='text-center font-bold text-3xl text-orange-600 underline'>fresh and best quality of our products</h2>
       <h2 className='text-center mt-5 mb-3' ><Link href={"/"} className='bg-gradient-to-tr from-orange-600 to-purple-700 p-3 rounded-lg text-white' >Go to home</Link></h2>
     <div className='flex gap-20 mb-3'>
        
        <div>
            <Image src={"/Pineapple_Free_Download_PNG_00d6089a14.png"} width={400} height={300} alt='img'/>
        </div>
        <div>
        <Image src={"/mango_transparent.png"} width={400} height={300} alt='img'/>
        </div>
        <div>
        <Image src={"/carrot.png"} width={400} height={300} alt='img'/>
        </div>
        </div>
        <div className='flex gap-20 mb-3'>
        <div> <Image src={"/purepng_com_orange_.png"} width={400} height={300} alt='img'/></div>
        <div> <Image src={"/fresh_green_capsicum.webp"} width={400} height={300} alt='img'/></div>
        <div> <Image src={"/coriander.webp"} width={400} height={300} alt='img'/></div>
     </div>
     <div className='flex gap-36 mb-3'>
        <div> <Image src={"/cilantro_lime.jpg"} width={300} height={300} alt='img'/></div>
        <div> <Image src={"/Oranges2.jpg"} width={400} height={300} alt='img'/></div>
        <div> <Image src={"/personal_care3.jpg"} width={450} height={250} alt='img'/></div>
     </div>
     <div className='flex gap-4'>
        <div> <Image src={"/grocery-image.png"} width={500} height={350} alt='img'/></div>
        <div> <Image src={"/grocery-image.png"} width={500} height={350} alt='img'/></div>
        <div> <Image src={"/grocery-image.png"} width={500} height={350} alt='img'/></div>
     </div>

    </div>
  )
}

export default page