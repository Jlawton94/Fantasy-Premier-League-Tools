import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PlayerData } from "../stucts/PlayerData";
import { FPLData } from "../stucts/FPLData";
import { baseUrl } from "..";
import { useSpinnerContext } from "./spinnerContext";

interface BaseDataContextProps {
    baseData: FPLData | undefined,
    currentWeek: number,
    weeklyLivePlayerData: Map<number, PlayerData> | undefined
}

const BaseDataContext = createContext<BaseDataContextProps>({
    baseData: undefined,
    currentWeek: 0,
    weeklyLivePlayerData: undefined
});

const BaseDataProvider = (props: any) => {
    const [baseData, setBaseData] = useState<FPLData | undefined>(undefined);
    const [currentWeek, setCurrentWeek] = useState<number>(0);
    const [weeklyLivePlayerData, setWeeklyLivePlayerData] = useState<Map<number, PlayerData>>(new Map());

    const addLoader = useSpinnerContext().addLoader;
    const deleteLoader = useSpinnerContext().deleteLoader;
    const setSpinnerText = useSpinnerContext().setSpinnerText;

    const fetchLiveDataForWeek = useCallback(async (week: number): Promise<PlayerData> => {
        addLoader();
        return fetch(`${baseUrl}/api/event/${week}/live/`)
            //return fetch(`data_offline/live_week1.json`)
            .then(response => {
                if (!response.ok) {
                    deleteLoader();
                    throw new Error("Error getting base data");
                }
                deleteLoader();
                return response.json()
            })
            .then((data: PlayerData) => {
                return data;
            })
    }, [addLoader, deleteLoader]);

    //Intialise the data
    useEffect(() => {
        //fetch base data
        addLoader();
        setSpinnerText("Loading Base Data...");
        fetch(`${baseUrl}/api/bootstrap-static/`)
            //fetch(`data_offline/base.json`)
            .then(response => {
                if (!response.ok) {
                    deleteLoader();
                    throw new Error("Error getting base data");
                }
                deleteLoader();
                return response.json()
            })
            .then((fplData: FPLData) => {
                setBaseData(fplData);
                //find the current week
                const weekNumber = fplData.events.filter((event) => event.is_current)[0].id;
                setCurrentWeek(weekNumber);

                //fetch live data for each week
                for (let weekIndex = 1; weekIndex <= weekNumber; weekIndex++) {
                    setSpinnerText("Loading Live Data...");
                    fetchLiveDataForWeek(weekIndex).then((playerData: PlayerData) => {
                        setWeeklyLivePlayerData(weeklyLivePlayerData.set(weekIndex, playerData));
                    })
                }
            })
    }, [fetchLiveDataForWeek, weeklyLivePlayerData, addLoader, deleteLoader, setSpinnerText])

    return (
        <BaseDataContext.Provider value={{ baseData, currentWeek, weeklyLivePlayerData }}>
            {props.children}
        </BaseDataContext.Provider>
    )
}

export default BaseDataProvider;

export const useBaseDataContext = () => useContext(BaseDataContext);