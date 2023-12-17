import { useCallback, useEffect, useState } from "react";
import { PlayerData } from "../stucts/PlayerData";
import { FPLData } from "../stucts/FPLData";
import React from "react";
import PerfectWeekView from "./perfectWeekView";
import { baseUrl } from "..";

export const LoaderContext = React.createContext<{ baseData: FPLData | undefined, currentWeek: number, weeklyLivePlayerData: Map<number, PlayerData> | undefined }>({ baseData: undefined, currentWeek: 0, weeklyLivePlayerData: undefined });

function Loader() {

    const [baseData, setBaseData] = useState<FPLData | undefined>(undefined);
    const [currentWeek, setCurrentWeek] = useState<number>(0);
    const [weeklyLivePlayerData, setWeeklyLivePlayerData] = useState<Map<number, PlayerData> | undefined>(undefined);

    const fetchLiveDataForWeek = useCallback(async (week: number): Promise<PlayerData> => {
        return await fetch(`${baseUrl}/api/event/${week}/live/`)
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
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error getting base data");
                }
                return response.json()
            })
            .then(async (fplData: FPLData) => {
                setBaseData(fplData);
                //find the current week
                const weekNumber = fplData.events.filter((event) => event.is_current)[0].id;
                setCurrentWeek(weekNumber);

                //fetch live data for each week
                let weeklyDataTemp = new Map<number, PlayerData>();
                for (let weekIndex = 1; weekIndex <= weekNumber; weekIndex++) {
                    weeklyDataTemp.set(weekIndex, await fetchLiveDataForWeek(weekIndex))
                }
                setWeeklyLivePlayerData(weeklyDataTemp);
            })
    }, [fetchLiveDataForWeek])

    return (
        <LoaderContext.Provider value={{ baseData, currentWeek, weeklyLivePlayerData }}>
            <PerfectWeekView />
        </LoaderContext.Provider>
    )
}

export default Loader;