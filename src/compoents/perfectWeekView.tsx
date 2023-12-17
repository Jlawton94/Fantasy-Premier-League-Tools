import { useCallback, useContext, useState } from "react";
import { PlayerPick, TeamPick } from "../stucts/UserPlayerPicks";
import { PlayerType } from "../stucts/FPLData";
import { FPLPicks } from "../stucts/FPLPicks";
import { LoaderContext } from "./loader";
import { baseUrl } from "..";
import UserPerfectWeekOverview from "./userPerfectWeekOverView";
import TeamPicker from "./teamPicker";

const PerfectWeekView = () => {
    const baseData = useContext(LoaderContext).baseData;
    const currentWeek = useContext(LoaderContext).currentWeek;
    const weeklyLivePlayerData = useContext(LoaderContext).weeklyLivePlayerData;

    const [pickedTeams, setPickedTeams] = useState<TeamPick[]>([]);
    const [perfectTeams, setPerfectTeams] = useState<TeamPick[]>([]);

    const [totalPointsMissed, setTotalPointsMissed] = useState<number>(0);

    const loadDataPerGameWeek = useCallback(async (teamId: string, week: number) => {
        console.log("load live data for all game weeks");
        let weeklyUserPicks = new Map<number, FPLPicks>();

        for (let weekInterator = 1; weekInterator <= week; weekInterator++) {
            await fetch(`${baseUrl}/api/entry/${teamId}/event/${weekInterator}/picks/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error loading user data for the week: ${weekInterator}`);
                    }
                    return response.json()
                })
                .then((response: FPLPicks) => {
                    weeklyUserPicks.set(weekInterator, response);
                })
        }
        return weeklyUserPicks;
    }, [])

    const calcPerfectPicks = useCallback((playerPicks: TeamPick, typesBaseData: PlayerType[], squadSize: number, week: number) => {
        let perfectPicks: TeamPick[] = perfectTeams;
        let perfectPlayers: PlayerPick[] = [];

        //pick the best captin
        let sortedPlayers = structuredClone(playerPicks.players);
        sortedPlayers = sortedPlayers.sort((player1: PlayerPick, player2: PlayerPick) => player2.points - player1.points);
        sortedPlayers.forEach((player: PlayerPick) => {
            player.pickData.is_captain = false;
            player.pickData.is_vice_captain = false;
            player.pickData.position = 0;
            player.pickData.multiplier = 0
        })

        sortedPlayers[0].pickData.is_captain = true;
        sortedPlayers[0].pickData.multiplier = 2;
        sortedPlayers[1].pickData.is_vice_captain = true;

        //pick the best player for each position
        typesBaseData.forEach((type: PlayerType) => {
            const minPicksForPostion: PlayerPick[] = [];
            const squadPlayerForType = sortedPlayers.filter((player: PlayerPick) => player.player_type?.id === type.id);

            squadPlayerForType.sort((squadPlayer1: PlayerPick, squadPlayer2: PlayerPick) => squadPlayer2.points - squadPlayer1.points)

            while (minPicksForPostion.length < type.squad_min_play) {
                const nextPLayer = squadPlayerForType[minPicksForPostion.length]
                nextPLayer.pickData.multiplier = nextPLayer.pickData.multiplier === 2 ? 2 : 1;
                minPicksForPostion.push(nextPLayer);
            }

            perfectPlayers = perfectPlayers.concat(minPicksForPostion);
        })

        sortedPlayers = sortedPlayers.filter((player: PlayerPick) => perfectPlayers.find((perfectPlayer) => perfectPlayer.pickData.element === player.pickData.element) === undefined)
        let index = 0;
        while (perfectPlayers.length < squadSize) {
            const nextPLayer = sortedPlayers[index];
            //check if the play can be added accoriding to squad rules
            if (perfectPlayers.filter(player => player.player_type.id === nextPLayer.player_type.id).length < nextPLayer.player_type.squad_max_play) {
                nextPLayer.pickData.multiplier = 1;
                perfectPlayers.push(nextPLayer);
            }
            index++;
        }

        sortedPlayers = sortedPlayers.filter((player: PlayerPick) => perfectPlayers.find((perfectPlayer) => perfectPlayer.pickData.element === player.pickData.element) === undefined)
        perfectPlayers = perfectPlayers.concat(sortedPlayers);


        let totalPoints = 0
        perfectPlayers.forEach((player) => {
            totalPoints += player.points * player.pickData.multiplier;
        })
        setTotalPointsMissed(totalPointsMissed + (playerPicks.totalPoints - totalPoints))

        const perfectTeam: TeamPick = {
            week: week,
            totalPoints: totalPoints,
            players: perfectPlayers
        }
        perfectPicks.push(perfectTeam);

        setPerfectTeams(perfectPicks);
    }, [perfectTeams, setPerfectTeams]);

    const buildUserWeeklyTeams = useCallback((userWeeklyTeamPicks: Map<number, FPLPicks>) => {
        console.log("load user team data for each week");

        if (userWeeklyTeamPicks && baseData && weeklyLivePlayerData) {
            let userPickedTeam: TeamPick[] = [];

            let loadedPlayers = new Map<number, PlayerPick>();

            for (let currentWeekInterator = 1; currentWeekInterator < currentWeek; currentWeekInterator++) {
                const userTeamForWeek = userWeeklyTeamPicks.get(currentWeekInterator);
                const weekPlayerData = weeklyLivePlayerData.get(currentWeekInterator);
                const playerPicksInWeek: PlayerPick[] = []

                if (userTeamForWeek) {
                    userTeamForWeek.picks.forEach((pickedPlayer => {
                        const playerId = pickedPlayer.element;
                        const emptyPlayerType = {
                            id: 0,
                            plural_name: "",
                            plural_name_short: "",
                            singular_name: "",
                            singular_name_short: "",
                            squad_select: 0,
                            squad_min_play: 0,
                            squad_max_play: 0,
                            ui_shirt_specific: false,
                            sub_positions_locked: [],
                            element_count: 0
                        }

                        let player: PlayerPick | undefined = {
                            name: "",
                            points: 0,
                            player_type: emptyPlayerType,
                            pickData: {
                                element: 0,
                                position: 0,
                                multiplier: 0,
                                is_captain: false,
                                is_vice_captain: false
                            }
                        }

                        if (loadedPlayers.get(playerId)) {
                            player = loadedPlayers.get(playerId);
                        } else {
                            const playerBaseData = baseData.elements.find((player) => playerId === player.id);
                            const playerType = baseData.element_types.find((types) => playerBaseData?.element_type === types.id)

                            player.name = playerBaseData?.web_name ? playerBaseData.web_name : "";
                            player.player_type = playerType ? playerType : emptyPlayerType;

                            loadedPlayers.set(playerId, structuredClone(player));
                        }

                        if (player) {
                            const playerData = weekPlayerData?.elements.find((data) => data.id === playerId);
                            const points = playerData?.stats.total_points;
                            player.points = points ? points : 0;
                            player.pickData = pickedPlayer;
                            playerPicksInWeek.push(structuredClone(player));
                        }

                    }))
                    const pick = {
                        week: currentWeekInterator,
                        players: playerPicksInWeek,
                        totalPoints: userTeamForWeek.entry_history.points
                    }
                    userPickedTeam.push(pick)

                    calcPerfectPicks(pick, baseData.element_types, baseData.game_settings.squad_squadplay, currentWeekInterator);
                }
            }

            setPickedTeams(userPickedTeam);
        }
    }, [baseData, currentWeek, weeklyLivePlayerData, perfectTeams, totalPointsMissed, calcPerfectPicks]);

    async function onTeamIdSubmit(data: { teamId: string }) {
        buildUserWeeklyTeams(await loadDataPerGameWeek(data.teamId, currentWeek));
    }

    return (
        <div>

            <TeamPicker submitHandler={onTeamIdSubmit} />

            Total points lost: {totalPointsMissed}

            {pickedTeams.map(function (team, i) {
                return (
                    <div key={`week${i}`}>
                        <UserPerfectWeekOverview userTeam={team} perfectTeam={perfectTeams[i]} />
                    </div>
                )
            })}

        </div>
    );
};

export default PerfectWeekView;