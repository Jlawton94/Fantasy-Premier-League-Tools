import React, { createContext, useContext, useState, useCallback } from 'react';

interface SpinnerContextProps {
    isActive: boolean;
    spinnerText: string;
    setSpinnerText: React.Dispatch<React.SetStateAction<string>>;
    addLoader: () => void;
    deleteLoader: () => void;
}

const SpinnerContext = createContext<SpinnerContextProps>({
    isActive: false,
    spinnerText: "Loading...",
    setSpinnerText: () => { },
    addLoader: () => { },
    deleteLoader: () => { },
});

const SpinnerProvider = (props: any) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [spinningText, setSpinningText] = useState<string>("Loading...");

    var loaderCount = 0;

    const addLoader = useCallback(() => {
        loaderCount++
        setIsActive(loaderCount > 0);
    }, [loaderCount]);

    const deleteLoader = useCallback(() => {
        loaderCount--;
        setIsActive(loaderCount > 0);
    }, [loaderCount]);

    return (
        <SpinnerContext.Provider value={{
            isActive: isActive,
            spinnerText: spinningText,
            setSpinnerText: setSpinningText,
            addLoader: addLoader,
            deleteLoader: deleteLoader
        }}>
            {props.children}
        </SpinnerContext.Provider>
    );
};

export default SpinnerProvider;

export const useSpinnerContext = () => useContext(SpinnerContext);
