import Image from 'next/image';
import React from 'react';

function Footer() {
  return (
    <div className='bg-red-50 py-8 px-4 md:px-8'>
      <div className='flex justify-center items-center'>
        <Image src={"/grocery-store.jpg"} width={200} height={60} alt='grocery' />
      </div>
      <p className='text-center text-lg text-green-500 mt-4 md:mt-8'>
        Our grocery store offers fresh and quality products
      </p>

      <ul className='flex flex-wrap justify-center mt-4 font-bold text-amber-600 text-lg'>
        <li className='mr-6 mb-4 md:mb-0'>About</li>
        <li className='mr-6 mb-4 md:mb-0'>Careers</li>
        <li className='mr-6 mb-4 md:mb-0'>History</li>
        <li className='mr-6 mb-4 md:mb-0'>Services</li>
        <li className='mr-6 mb-4 md:mb-0'>Projects</li>
        <li className='mr-6 mb-4 md:mb-0'>Blog</li>
      </ul>
    </div>
  );
}

export default Footer;
