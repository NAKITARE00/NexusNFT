import React, { useState } from 'react';
import { search } from '../assets';

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex items-center w-full max-w-[458px] transition-all duration-300 ease-in-out">
      <input
        type="text"
        placeholder="Search property"
        className={`
          flex-grow py-2 pl-4 pr-2
          font-epilogue font-normal text-[14px]
          placeholder:text-[#4b5264] text-black
          bg-transparent outline-none
          transition-all duration-300 ease-in-out
          border-b-[1px] rounded-[5px]
          ${isFocused ? 'border-[#4acd8d] shadow-[0_5px_8px_-1px_rgba(84,305,241,0.5)]' : 'border-[#4acd8d]'}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button
        className="
          w-[52px] h-[42px]
          flex justify-center items-center
          text-[#4acd8d] hover:text-black
          transition-colors duration-300 ease-in-out
        "
      >
         <div className='w-[42px] h-full rounded-[240px] 
                bg-[#4acd8d] flex justify-center 
                items-center cursor-pointer'>
                    <img src={search} alt="search" className='w-[15px] h-[15px]
                    object-contain'
                    />
                </div>
      </button>
    </div>
  );
};

export default SearchInput