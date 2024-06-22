import Image from 'next/image';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


interface SliderProps {
  sliderList: {
    attributes: {
      name: string;
      image: {
        data: {
          id: number;
          attributes: {
            name: string;
            alternativeText: string | null;
            caption: string | null;
            width: number;
            height: number;
            formats: any; // Define a type for formats if needed
            hash: string;
            ext: string;
            mime: string;
            size: number;
            url: string;
            previewUrl: string | null;
            provider: string;
            provider_metadata: any | null; // Define a type for provider_metadata if needed
            createdAt: string;
            updatedAt: string;
          };
        }[];
      };
    };
  }[];
}

function Slider({ sliderList }: SliderProps) {
 // console.log(sliderList);
  // Your Slider component implementation
  return (
<Carousel className=''>
  <CarouselContent>
  {sliderList.map((value, i) => (
 <CarouselItem key={i}>
       
          {value.attributes.image.data.map((item, j) => (
              <Image className='w-full object-cover rounded-2xl h-[280px] md:h-[400px]'
              key={j}
              src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + item.attributes.url}
          
             width={800}
             height={400}
              alt='img'
            />
          ))}
          <h2 className='text-white text-center bg-gradient-to-br from-green-600 to-red-500 rounded-xl p-2 mb-3 mt-3'>{value.attributes.name}</h2>
          </CarouselItem>
      ))}
   
 
   
   
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>


    
  
  );
}

export default Slider;
