import React, { useContext, useReducer, Reducer, useState } from "react";
import { toast } from 'react-toastify';

import OCFC from "../../context/ocfc";
import { ActiveTabContext } from "../../context/activeTab";
import TransparentContainer from "../../components/TransparentContainer";
import { FighterInitialState, FigtherReducer } from "../../reducers/createFigther";


const CreateFight: React.FC = () => {


    const OCFCContext = useContext(OCFC);
    const ActiveTab = useContext(ActiveTabContext);

    const [stats, dispatch] = useReducer(FigtherReducer, FighterInitialState);
    const [isLoading, setIsLoading] = useState(false);

    if (!OCFCContext) return null;
    if (!ActiveTab) return null;

    const { account, createFight } = OCFCContext;
    const { changeActiveTabIndex } = ActiveTab;

    const handleCreateFight = async () => {
        if (!account) return;
        const { attack, defense, speed } = stats;

        try {
            setIsLoading(true);
            const result = await toast.promise(
                createFight(account, attack, defense, speed),
                {
                    pending: 'Creating Fight...',
                    success: 'Fight Created!',
                    error: 'Error Creating Fight',
                }
            );
            setIsLoading(false);
            result.status = true ? changeActiveTabIndex(1) : null;
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            return;
        }
    };

    const remainingPoints = 100 - (stats.attack + stats.defense + stats.speed);

    return (
        <TransparentContainer className="w-8/12">
            <h1 className="text-left font-bold text-5xl text-[#fbfbfe]">Create Fight</h1>
            <p className="mt-2 font-extralight  text-lg">{`Give your warrior stats. You have ${remainingPoints} points to give your Fighther`}</p>
            <form>
                <label className="block mt-4">
                    <h3 className="p-1 font-bold">Attack Damage</h3>
                    <input type="range" min="0" max="100"
                        value={stats.attack}
                        onChange={(e) => dispatch({ type: 'SET_ATTACK', payload: { attack: Number(e.target.value) } })}
                        className="range range-primary" />
                    <span className="range-value">{stats.attack}</span>
                </label>
                <label className="block mt-4">
                    <h3 className="p-1 font-bold">Defense</h3>
                    <input type="range" min="0" max="100"
                        value={stats.defense}
                        onChange={(e) => dispatch({ type: 'SET_DEFENSE', payload: { defense: Number(e.target.value) } })}
                        className="range range-secondary" />
                    <span className="range-value">{stats.defense}</span>
                </label>
                <label className="block mt-4">
                    <h3 className="p-1 font-bold">Speed</h3>
                    <input type="range" min="0" max="100"
                        value={stats.speed}
                        onChange={(e) => dispatch({ type: 'SET_SPEED', payload: { speed: Number(e.target.value) } })}
                        className="range range-warning" />
                    <span className="range-value">{stats.speed}</span>
                </label>
            </form>
            <div className="flex justify-center w-full">
                {
                    !isLoading ?
                        <button type="button" className="btn btn-primary mt-4" onClick={handleCreateFight}>Create Fight</button>
                        :
                        <button type="button" className="btn btn-primary mt-4" disabled>Loading</button>
                }
            </div>
        </TransparentContainer >
    );
};

export default CreateFight;