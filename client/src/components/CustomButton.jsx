import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles }) => {
    return (
        <button
            type={btnType}
            className={`font-epilogue font-semibold text-[14px] 
            leading-[16px] text-white px-3 py-1 rounded-[10px] ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    )
}

export default CustomButton