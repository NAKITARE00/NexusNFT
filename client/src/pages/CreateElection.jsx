import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { CustomButton, FormField, Footer } from '../components';
import { checkIfImage } from '../utils';

const CreateElection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { createElection } = useStateContext();
    const [candidates, setCandidates] = useState([]);
    const [form, setForm] = useState({
        electionName: '',
        voteToken: '',
        image: '',
        newCandidateAddress: '', // New input for candidate address
    });

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const addCandidate = () => {
        if (form.newCandidateAddress) {
            setCandidates([...candidates, form.newCandidateAddress]);
            setForm({ ...form, newCandidateAddress: '' }); // Clear the input field after adding
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedToken = ethers.utils.parseUnits(form.voteToken, 18);

        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setLoading(true);
                console.log(candidates)
                await createElection(
                    form.electionName,
                    formattedToken,
                    form.image,
                    candidates,
                );

                setLoading(false);
                navigate('/');
            } else {
                alert('Provide a valid image URL');
                setForm({ ...form, image: '' });
            }
        });
    };
    return (
        <div className="flex justify-center items-center flex-col rounded-[10px]">
            {loading && 'Loader...'}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[24px] text-[17px] leading-[37px] text-black">List Your Property</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-[full] mt-[65px] text-black flex flex-col gap-[30px] sm:min-w-[380px]">
                <div className="flex flex-col gap-[40px]">
                    <FormField
                        labelName="Property Name *"
                        placeholder="Enter Property Name"
                        inputType="text"
                        value={form.electionName}
                        handleChange={(e) => handleFormFieldChange('electionName', e)}
                    />
                    <FormField
                        labelName="Property Address *"
                        placeholder="Enter Property Address"
                        inputType="text"
                        value={form.voteToken}
                        handleChange={(e) => handleFormFieldChange('voteToken', e)}
                    />
                </div>
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Property URI *"
                        placeholder="Enter Image URL"
                        inputType="url"
                        value={form.image}
                        handleChange={(e) => handleFormFieldChange('image', e)}
                    />
                </div>
            
                <div className="flex justify-center items-center mb-[30px]">
                    <CustomButton
                        btnType="submit"
                        title="Create"
                        styles="bg-[#1dc071] py-[20px]"
                        handleClick={handleSubmit}
                    />
                </div>
            </form>
            <Footer />
        </div>
    );
}

export default CreateElection;
