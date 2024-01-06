import { useCallback, useContext, useEffect, useState } from "react";
import { PlayerData } from "../stucts/PlayerData";
import { FPLData } from "../stucts/FPLData";
import React from "react";
import { baseUrl } from "..";

const LoaderContext = React.createContext<{ baseData: FPLData | undefined, currentWeek: number, weeklyLivePlayerData: Map<number, PlayerData> | undefined }>({ baseData: undefined, currentWeek: 0, weeklyLivePlayerData: undefined });

const Loader = (props: any) => {

    const [baseData, setBaseData] = useState<FPLData | undefined>(undefined);
    const [currentWeek, setCurrentWeek] = useState<number>(0);
    const [weeklyLivePlayerData, setWeeklyLivePlayerData] = useState<Map<number, PlayerData>>(new Map());

    const fetchLiveDataForWeek = useCallback(async (week: number): Promise<PlayerData> => {
        return fetch(`${baseUrl}/api/event/${week}/live/`)
            //return fetch(`data_offline/live_week1.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error getting base data");
                }
                return response.json()
            })
            .then((data: PlayerData) => {
                return data;
            })
    }, []);

    //Intialise the data
    useEffect(() => {
        //fetch base data
        fetch(`${baseUrl}/api/bootstrap-static/`)
            //fetch(`data_offline/base.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error getting base data");
                }
                return response.json()
            })
            .then((fplData: FPLData) => {
                setBaseData(fplData);
                //find the current week
                const weekNumber = fplData.events.filter((event) => event.is_current)[0].id;
                setCurrentWeek(weekNumber);

                //fetch live data for each week
                for (let weekIndex = 1; weekIndex <= weekNumber; weekIndex++) {
                    fetchLiveDataForWeek(weekIndex).then((playerData: PlayerData) => {
                        setWeeklyLivePlayerData(weeklyLivePlayerData.set(weekIndex, playerData));
                    })
                }
            })
    }, [fetchLiveDataForWeek, weeklyLivePlayerData])

    return (
        <LoaderContext.Provider value={{ baseData, currentWeek, weeklyLivePlayerData }}>
            {props.children}
        </LoaderContext.Provider>
    )
}

export default Loader;

export const useLoaderContext = () => useContext(LoaderContext);