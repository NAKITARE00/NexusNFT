import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import TipperDapp from '../contracts/TipperDapp.json';


const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xC4d42d1b84437cCD82fF8331b20A5dAf1C05DD3d', TipperDapp.abi);
    const { mutateAsync: createElection } = useContractWrite(contract, 'createElection');
    const { mutateAsync: registerTipper } = useContractWrite(contract, 'registerTipper');
    const { mutateAsync: registerArtist } = useContractWrite(contract, 'registerArtist');
    const { mutateAsync: make_Tip } = useContractWrite(contract, 'make_Tip');
    const address = useAddress();
    const connect = useMetamask();

    const publishRealEstate = async (propertyAddress, valuation, fractionalShares, tokenURI) => {
        try {
            const data = await tokenizeRealEstate({
                args: [
                    propertyAddress,
                    valuation,
                    fractionalShares,
                    tokenURI
                ]
            });
            console.log("contract call succes", data);
        } catch (error) {
            console.log("contract call failed", error);
        }
    }

    const publishTransferShares = async (tokenId, to, shares) => {
        try {
            const data = await transferOwnershipShares({
                args: [
                    tokenId,
                    to,
                    shares
                ]
            });
            console.log("contract call succes", data);
        } catch (error) {
            console.log("contract call failed", error);
        }
    }

    const publishOwnershipShares = async (tokenId, owner) => {
        try {
            const data = await getOwnershipShares({
                args: [
                    tokenId,
                    owner
                ]
            })
            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failed", error)
        }

    }

    const getAllTokens = async () => {
        const tokens = await contract.call
            ('getAllTokens');

        const parsedTokens = tokens.map((token, i) => ({
            owner: election.owner,
            electionName: election.electionName,
            voteToken: ethers.utils.formatEther
                (election.voteToken.toString()),
            image: election.image,
            candidateAddress: election.candidateAddress,
            pId: i
        }));
        return (parsedElections);
    }

    const getUserElections = async () => {
        const allElections = await getElections();

        const filteredElections = allElections.filter((election) =>
            election.owner === address);
        return filteredElections;

    }

    const makeVote = async (_electionId, _candidateAddress, voteToken) => {

        const data = await contract.call('makeVote', [_electionId, _candidateAddress], {
            value: ethers.utils.parseEther
                (voteToken)
        });

        return data;
    }
    const viewResults = async (_electionId) => {
        try {
            const results = await contract.call('viewResults', [_electionId]);
            const numberOfResults = results[0].length;

            const voteCounts = {}; // Object to store the aggregated vote counts

            for (let i = 0; i < numberOfResults; i++) {
                const candidateAddress = results[0][i];
                const voteCount = parseInt(results[1][i].toString(), 10);

                // Check if this candidate address is already in the voteCounts object
                if (voteCounts[candidateAddress]) {
                    // If it exists, add the vote count
                    voteCounts[candidateAddress] += voteCount;
                } else {
                    // If it doesn't exist, initialize it with the vote count
                    voteCounts[candidateAddress] = voteCount;
                }
            }

            // Convert the voteCounts object back to an array of objects
            const parsedResults = Object.keys(voteCounts).map(candidateAddress => ({
                candidateAddress,
                voteCount: voteCounts[candidateAddress].toString(),
            }));

            return parsedResults;
        } catch (error) {
            console.log(error);
        }
    }

    const publishTip = async (_artistAddress, token) => {
        try {
            const data = await contract.call('make_Tip', [_artistAddress], {
                value: ethers.utils.parseEther
                    (token)
            });
            console.log(data)
            return data;
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                tokenizeRealEstate: publishRealEstate,
                transferOwnershipShares: publishTransferShares,
                getOwnershipShares: publishOwnershipShares,
                getElections,
                getUserElections,
                makeVote,
                viewResults,
                make_Tip: publishTip,
                registerTipper: publishTipper,
                registerArtist: publishArtist
            }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);

