import { useState, useEffect, createContext } from "react";

import Web3 from "web3";
import OCFC from "../contracts/OCFC.json";

interface Ocfc {
    // The address of the current account
    account: string;
    // An object containing the contract's methods
    contract: {
        methods: {
            mintMember(): {
                send(options: { from: string; }): Promise<any>;
            };
            createFight(address: string, move1: number, move2: number, move3: number): {
                send(options: { from: string; }): Promise<any>;
            };
            joinAndFight(fightId: number, move1: number, move2: number, move3: number): {
                send(options: { from: string; }): Promise<any>;
            };
            trainFighter(address: string): {
                send(options: { from: string; }): Promise<any>;
            };
            withdraw(): {
                send(options: { from: string; }): Promise<any>;
            };
            balanceOf(address: string): {
                call(options: { from: string; }): Promise<any>;
            };
        };
    }
}

interface OcfcContext {
    account: string;
    contract: Ocfc["contract"] | null;
    isWalletConnected: boolean;
    getBalance: () => Promise<any>;
    connectWallet: () => Promise<any>
    mintMember: () => Promise<any>;
    isAlreadyMember: () => Promise<boolean | undefined>;
    createFight: (address: string, move1: number, move2: number, move3: number) => Promise<any>;
    joinAndFight: (fightId: number, move1: number, move2: number, move3: number) => Promise<any>;
    trainFighter: (address: string) => Promise<any>;
    withdraw: () => Promise<any>;
}

const OcfcContext = createContext<OcfcContext | null>(null);

declare global {
    interface Window {
        ethereum: any;
    }
}

const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const ethereum = window.ethereum;
        await ethereum.request({ method: "eth_requestAccounts" });
        return ethereum;
    }
}

const getContract = async (ethereum: any): Promise<Ocfc["contract"] | undefined> => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const web3 = new Web3(ethereum);
        const contract = new web3.eth.Contract(OCFC.abi as any, OCFC.networks["43113"].address) || null;
        return contract;
    }
}

export const OCFCProvider = (props: any) => {
    const [account, setAccount] = useState("");
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [contract, setContract] = useState<Ocfc["contract"] | null>(null);


    useEffect(() => {
        const connect = async () => {
            const ethereum = await connectWallet();
            if (!ethereum) return;

            setAccount(ethereum.selectedAddress);

            const contract = await getContract(ethereum);
            if (!contract) return;
            setContract(contract);
            setIsWalletConnected(true);
        }
        connect();
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            })
            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            })
        }
    })

    const mintMember = async () => {
        if (!contract) return;

        const result = await contract.methods.mintMember().send({ from: account });
        return result;
    }

    const isAlreadyMember = async () => {
        if (!contract) return;
        const result = await contract.methods.balanceOf(account).call({ from: account });

        if (result > 0) {
            return true;
        }
        return false;
    }

    const createFight = async (address: string, move1: number, move2: number, move3: number) => {
        if (!contract) return;

        const result = await contract.methods.createFight(address, move1, move2, move3).send({ from: account });
        return result;
    }

    const joinAndFight = async (fightId: number, move1: number, move2: number, move3: number) => {
        if (!contract) return;

        const result = await contract.methods.joinAndFight(fightId, move1, move2, move3).send({ from: account });
        return result;
    }

    const trainFighter = async (address: string) => {
        if (!contract) return;

        const result = await contract.methods.trainFighter(address).send({ from: account });
        return result;
    }

    const withdraw = async () => {
        if (!contract) return;

        const result = await contract.methods.withdraw().send({ from: account });
        return result;
    }

    const getBalance = async () => {
        if (!contract) return;
        const result = await contract.methods.balanceOf(account).call({ from: account });
        return result;
    }

    return (
        <OcfcContext.Provider
            value={{
                account,
                contract,
                isWalletConnected,
                getBalance,
                connectWallet,
                mintMember,
                isAlreadyMember,
                createFight,
                joinAndFight,
                trainFighter,
                withdraw
            }}>
            {props.children}
        </OcfcContext.Provider>
    );
}

export default OcfcContext;