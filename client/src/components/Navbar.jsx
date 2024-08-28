import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton, SearchInput } from "./";
import { tipper, menu,profile, nexuslogo } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');

    const [toggleDrawer, setToggleDrawer] = useState(false);

    const { connect, address } = useStateContext();

    const navLinks = [
        { name: 'Buy', path: '/' },
        { name: 'Favorites', path: '/favorites' },
        { name: 'Help', path: '/help' },
        { name: 'About', path: '/about' },
      ];


    return (
        <div className="flex md:flex-row flex-col-reverse justify-between mt-[1px]
        mb-[35px] gap-5 bg-white border-[2px] rounded-[5px] border-grey p-[5px] px-[30px]">
            <div className="flex items-center ">
                <Link to="/">
                    <img src={nexuslogo} alt="nexuslogo" className="w-[80px] h-[40px] rounded-full object-contain cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out" />
                </Link>
            </div>
            <SearchInput />
            <div className="hidden md:flex space-x-10 items-center font-epilogue">
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.path}
                    className={`   text-black hover:text-[#4acd8d] transition-colors relative
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                        after:bg-[#4acd8d] after:transition-transform after:duration-300
                        after:origin-left after:scale-x-0 hover:after:scale-x-100 ${
                    location.pathname === link.path ? 'font-bold' : 'font-epilogue'
                }`}
                >
                    {link.name}
                </Link>
                ))}
            </div>

            <div className="sm:flex hidden flex-row justify-end gap-4">
                <CustomButton
                    btnType="button"
                    title={address ? 'Property' : 'Connect'}
                    styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                    height="h-[5px]"
                    handleClick={() => {
                        if (address) navigate('create-election')
                        else connect();
                    }}
                />
                <Link to="/profile">
                    <div className="w-[52px] h-[52px] rounded-full
                    bg-[#2c2f32] flex justify-center items-center
                    cursor-pointer">
                        <img src={profile} alt="user" className="w-[60%]
                        h-[60%] object-contain"/>
                    </div>
                </Link>
            </div>
            {/* Mobile View */}
            <div className="sm:hidden flex pt-[1px] justify-between items-center relative">
                <div className="w-[55px] h-[60px]  flex justify-center items-center cursor-pointer">
                    <img src={tipper} alt="user" className="w-[95%] h-[90%] object-contain" />
                </div>

                <img
                    src={menu}
                    alt="menu"
                    className="w-[34px] h-[34px] object-contain cursor-pointer"
                    onClick={() => setToggleDrawer((prev) => !prev)}
                />

                <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
                    <ul className="mb-4">
                        {navlinks.map((link) => (
                            <li
                                key={link.name}
                                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                                onClick={() => {
                                    setIsActive(link.name);
                                    setToggleDrawer(false);
                                    navigate(link.link);
                                }}
                            >
                                <img
                                    src={link.imgUrl}
                                    alt={link.name}
                                    className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                                />
                                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                                    {link.name}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="flex mx-4">
                        <CustomButton
                            btnType="button"
                            title={address ? 'Create Election' : 'Connect'}
                            styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                            handleClick={() => {
                                if (address) navigate('create-election')
                                else connect();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar