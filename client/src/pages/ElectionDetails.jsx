import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { profile } from '../assets';


const ElectionDetails = () => {
    const { state } = useLocation();
    const { makeVote, viewResults, contract, address } = useStateContext()

    const [isLoading, setIsLoading] = useState(false);
    const [candidate, setCandidate] = useState([]);
    const [results, setResults] = useState([]);

    const fetchResults = async () => {
        const data = await viewResults(state.pId);
        setResults(data);
        console.log(data);

    }

    useEffect(() => {
        if (contract) fetchResults();
    }, [contract, address])

    const handleVote = async () => {
        setIsLoading(true);
        await makeVote(state.pId, candidate, state.voteToken)
        setIsLoading(false);
    }

    return (
        <div>
            {isLoading && 'Loading...'}
            <div className="w-full flex md:flex-row flex-col mt-10
            gap-[30px]">
                <div className="flex-1 flex-col">
                    <img src={state.image} alt="election" className="w-full 
                    h-[410px] object-cover rounded-xl"/>
                    <div className="relative w-full h-[5px] bg-[#3a3a43]">
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gao-[40px]">
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
                            Owner
                        </h4>

                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[18px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <img src={profile} alt="user" className="w-[60%] h-[60%] object-contain" />
                            </div>
                            <div>
                                <h4 className="font-epilogue font-semibold text-[14px] text-black break-all">{state.owner}</h4>
                                <h4 className="font-epilogue font-semibold text-[14px] text-black break-all">Token - {state.voteToken}</h4>
                                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]"></p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[20px]">
                        <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">StakeHolders</h4>
                        <div className="mt-[20px] flex flex-col gap-4">
                            {state.candidateAddress && state.candidateAddress.length > 0 ? (
                                state.candidateAddress.map((candidateAddress, index) => (
                                    <div key={index} className="font-epilogue font-normal text-[16px] text-black">
                                        {candidateAddress}
                                    </div>
                                ))
                            ) : (
                                <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-2">No Candidates</p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 mt-[20px]">
                        <h4 className="font-epilogue font-semibold text-[18px] 
                         text-black uppercase">
                            Purchase Asset Shares
                        </h4>

                        <div className=" flex flex-col p-4 rounded-[10px]">
                            <div className="mt-[5px]">
                                <input type="text" placeholder="Token amount"
                                    className=" bg-transparent rounded-[10px]
                                 border border-grey py-2 px-4 text-black
                                 placeholder-black
                                 focus:outline-none
                                focus:shadow-[0_5px_8px_-1px_rgba(84,305,241,0.5)]"
                                    value={candidate}
                                    onChange={(e) => setCandidate(e.target.value)}
                                />
                            </div>
                            <div className="my-[20px]">
                                <CustomButton
                                    btnType="button"
                                    title="STAKE"
                                    styles="bg-green-500 text-white"
                                    handleClick={handleVote}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-epilogue font-semibold text-[18px] 
                         text-black uppercase">
                        Real Estate Asset 
                    </h4>
                    {/* <div>
                        {results.length > 0 ? results.map((item, index) => (
                            <div key={`${item.candidateAddress}-${index}`}
                                className="flex justify-between items-center gap-4"
                            >
                                <p className="font-epilogue font-normal text-[16px] leading-[26px] break-ll">
                                    {index + 1}. {item.candidateAddress}</p>
                                <p className="font-epilogue font-normal text-[16px] leading-[26px] break-ll">
                                    {item.voteCount}</p>
                            </div>
                        )) : (
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No Votes</p>
                        )}
                    </div> */}
                </div>
            </div>
        </div >
    )
}

export default ElectionDetails