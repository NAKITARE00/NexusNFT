import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { DisplayElections } from '../components';

import { useStateContext } from '../context';
import { CustomButton, FormField } from '../components';

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { address, contract, getElections, make_Tip } = useStateContext();
    const [form, setForm] = useState({
        artistAddress: '',
        token: ''
    });
    const [elections, setElections] = useState([]);
    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();


        // Check if both artistAddress and token are filled
        if (form.artistAddress && form.token) {
            // const { artistAddress, token } = form;
            // const formattedToken = ethers.utils.parseUnits(token, 18);
            try {
                setIsLoading(true);
                await make_Tip(form.artistAddress, form.token);
                setIsLoading(false);
                navigate('/success'); // Redirect to a success page
            } catch (error) {
                // Handle any errors, e.g., display an error message
                console.error(error);
                setIsLoading(false);
            }
        } else {
            // Handle the case where inputs are not filled
            alert('Please fill in both the Artist Address and Token fields.');
        }
    }

    const fetchElections = async () => {
        setIsLoading(true);
        const data = await getElections();
        setElections(data);
        setIsLoading(false);
    }
    useEffect(() => {
        if (contract) fetchElections();
    }, [address, contract]);
    return (
        <div className="bg-[white] flex justify-center
        items-center flex-col rounded-[10px] sm:p-10p-4">
            
            <div className="justify-left flex flex-row">
                <DisplayElections
                    title=""
                    isLoading={isLoading}
                    elections={elections}
                />
            </div>

        </div>
    )
}

export default Home