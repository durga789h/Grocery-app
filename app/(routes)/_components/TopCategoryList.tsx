import { CategoryListProps } from '@/app/_components/CategoryList'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function TopCategoryList({categoryList,selectedCategory}:CategoryListProps & { selectedCategory: string }) {
  return (
    <div className='mt-3'>
      
      <div className='list-none flex flex-wrap gap-5 mt-2 overflow-auto mx-7 md:mx-20 justify-center'>
        {categoryList.map(category => (

          <Link href={"/products-category/" +category.attributes.name}
           key={category.id}
            className={`flex flex-col items-center w-[180px]
          hover:bg-green-200 bg-orange-100 gap-3 p-3 rounded-lg group cursor-pointer ${selectedCategory==category.attributes.name && 'bg-green-500 text-white'}`}>
            {/* Render your category name */}
           
            {/* Map over icon data and render images */}
            {category.attributes.icon.data.map((item, j) => (
              <Image
                key={j}
                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + item.attributes.url}
                unoptimized={true}
                width={90}
                height={60}
                alt='icon'
                className='group-hover:scale-125 transition-all ease-in-out'
              />
            ))}
            <h2 className='text-orange-700'> {category.attributes.name}</h2>
          </Link>
        ))}
      </div>
      <Link href={"/"} className='border w-full text-white bg-purple-600 border-purple-600 p-3 rounded-full'>Go to home</Link>
    </div>
  )
}

export default TopCategoryList