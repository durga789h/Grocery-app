import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface Category {
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

export interface CategoryListProps {
  categoryList: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categoryList }) => {
  return (
    <div className='mt-3'>
      <h2 className='text-lime-500 font-bold text-2xl'>Shop by Category</h2>
      <div className='list-none grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-5'>
        {categoryList.map(category => (

          <Link href={"/products-category/" +category.attributes.name} key={category.id} className='flex flex-col items-center 
          hover:bg-green-200 bg-orange-100 gap-3 p-3 rounded-lg group cursor-pointer'>
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
     
    </div>
  );
}

export default CategoryList;
