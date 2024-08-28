import React from 'react'

const FormField = ({ labelName, placeholder, inputType, value, handleChange }) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-epilogue font-medium text-[15px] leading-[23px]
                text-black mb-[10px]">{labelName}</span>
            )}
            <input
                requiredvalue={value}
                onChange={handleChange}
                type={inputType}
                step="0.1"
                placeholder={placeholder}
                className="py-[15px] sm:px-[25px] px-[15px] 
                outline-none border-[1px] border-[] 
                bg-transparent font-epilogue text-black text-[14px] 
                placeholder:text-[#4b5264] 
                rounded-[10px] sm:min-w-[300px]
                focus:shadow-[0_5px_8px_-1px_rgba(84,305,241,0.5)]
                "
            />

        </label>
    )
}

export default FormField