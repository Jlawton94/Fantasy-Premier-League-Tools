import { useCallback, useEffect, useState } from "react";
import { PlayerPick, TeamPick } from "../stucts/UserPlayerPicks";
import { PlayerType } from "../stucts/FPLData";
import { FPLPicks } from "../stucts/FPLPicks";
import { useBaseDataContext } from "../context/baseDataContext";
import { baseUrl } from "..";
import UserPerfectWeekOverview from "../compoents/userPefectWeek/userPerfectWeekOverView";
import TeamPicker from "../compoents/teamPicker";
import { useParams } from "react-router-dom";
import { useSpinnerContext } from "../context/spinnerContext";

const PerfectManagerUser = () => {
    const baseData = useBaseDataContext().baseData;
    const currentWeek = useBaseDataContext().currentWeek;
    const weeklyLivePlayerData = useBaseDataContext().weeklyLivePlayerData;

    const { id } = useParams();
    const [pickedTeams, setPickedTeams] = useState<Map<number, TeamPick>>(new Map());
    const [perfectTeams, setPerfectTeams] = useState<Map<number, TeamPick>>(new Map());
    const [teamName, setTeamName] = useState<string>("");

    const [loaded, setLoaded] = useState<boolean>(false);

    const addLoader = useSpinnerContext().addLoader;
    const deleteLoader = useSpinnerContext().deleteLoader;
    const setSpinnerText = useSpinnerContext().setSpinnerText;

    const calcPerfectPicks = useCallback((playerPicks: TeamPick, typesBaseData: PlayerType[], squadSize: number, week: number): TeamPick => {
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

        const perfectTeam: TeamPick = {
            week: week,
            totalPoints: totalPoints,
            players: perfectPlayers,
            transferCost: playerPicks.transferCost
        }
        return perfectTeam;
    }, []);

    const buildUserTeamPerWeek = useCallback((userWeeklyTeamPick: FPLPicks, week: number) => {
        if (userWeeklyTeamPick && baseData && weeklyLivePlayerData) {
            let userPickedTeam: TeamPick;
            let perfectTeam: TeamPick;

            let loadedPlayers = new Map<number, PlayerPick>();

            const weekPlayerData = weeklyLivePlayerData.get(week);
            const playerPicksInWeek: PlayerPick[] = []

            if (userWeeklyTeamPick) {
                userWeeklyTeamPick.picks.forEach((pickedPlayer => {
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
                    week: week,
                    players: playerPicksInWeek,
                    totalPoints: userWeeklyTeamPick.entry_history.points,
                    transferCost: userWeeklyTeamPick.entry_history.event_transfers_cost
                }
                userPickedTeam = pick;

                const perfectPick = calcPerfectPicks(pick, baseData.element_types, baseData.game_settings.squad_squadplay, week);
                perfectTeam = perfectPick;

                setPerfectTeams(perfectTeams.set(week, perfectTeam));
                setPickedTeams(pickedTeams.set(week, userPickedTeam));

                if (perfectTeams.size === currentWeek && pickedTeams.size === currentWeek) {
                    setLoaded(true);
                }
            }
        }
    }, [baseData, weeklyLivePlayerData, calcPerfectPicks, perfectTeams, pickedTeams, currentWeek]);

    const loadDataPerGameWeek = useCallback(async (teamId: string, week: number) => {

        for (let weekInterator = 1; weekInterator <= week; weekInterator++) {
            addLoader();
            fetch(`${baseUrl}/api/entry/${teamId}/event/${weekInterator}/picks/`)
                //await fetch(`data_offline/picks_week1.json`)
                .then(response => {
                    if (!response.ok) {
                        deleteLoader();
                        throw new Error(`Error loading user data for the week: ${weekInterator}`);
                    }
                    deleteLoader();
                    return response.json()
                })
                .then((userPicks: FPLPicks) => {
                    buildUserTeamPerWeek(userPicks, weekInterator);

                })
        }
    }, [buildUserTeamPerWeek, addLoader, deleteLoader])

    const loadTeamData = useCallback(async (teamId: string) => {
        addLoader();
        fetch(`${baseUrl}/api/entry/${teamId}/`)
            .then(response => {
                if (!response.ok) {
                    deleteLoader();
                    throw new Error(`Error loading user team data`);
                }
                deleteLoader();
                return response.json()
            })
            .then((teamData) => {
                setTeamName(teamData.name);
            })
    }, [addLoader, deleteLoader]);

    const onTeamIdSubmit = useCallback(async (data: { teamId: string }) => {
        //clear the data
        setLoaded(false);
        setSpinnerText("Loading User Data...");

        loadDataPerGameWeek(data.teamId, currentWeek);
        loadTeamData(data.teamId);
        window.history.replaceState(null, "", `/perfect-manager-user/${data.teamId}`);
    }, [currentWeek, loadDataPerGameWeek, loadTeamData, setSpinnerText]);

    useEffect(() => {
        if (id) {
            onTeamIdSubmit({ teamId: id });
        }
    }, [id, onTeamIdSubmit]);

    function getPerfectWeekOverviewMap(teamPicks: Map<number, TeamPick>) {
        let perfectWeekOverviews: JSX.Element[] = [];
        for (let i = 1; i <= currentWeek; i++) {
            const weekUserPick = teamPicks.get(i);
            const weekPerfectPick = perfectTeams.get(i);

            if (weekUserPick && weekPerfectPick) {
                perfectWeekOverviews.push(
                    <div key={`week${i}`}>
                        <UserPerfectWeekOverview userTeam={weekUserPick} perfectTeam={weekPerfectPick} />
                    </div>
                );
            }
        }
        return perfectWeekOverviews;
    }

    function getTotalPointsMissedByWeek(teamPicks: Map<number, TeamPick>, perfectTeamPicks: Map<number, TeamPick>): number {
        let totalPoints = 0;
        for (let i = 1; i <= currentWeek; i++) {
            const weekUserPick = teamPicks.get(i);
            const weekPerfectPick = perfectTeamPicks.get(i);

            if (weekUserPick && weekPerfectPick) {
                totalPoints += weekPerfectPick.totalPoints - weekUserPick.totalPoints;
            }
        }
        return totalPoints;
    }

    function getTotalPoints(teamPicks: Map<number, TeamPick>): number {
        let totalPoints = 0;
        for (let i = 1; i <= currentWeek; i++) {
            const weekPick = teamPicks.get(i);
            if (weekPick) {
                totalPoints += weekPick.totalPoints - weekPick.transferCost;
            }
        }
        return totalPoints;
    }

    return (
        <div className="col p-2">

            <TeamPicker submitHandler={onTeamIdSubmit} />

            {loaded && (
                <>
                    <div>
                        {teamName}
                        <br />
                        Total points lost: {getTotalPointsMissedByWeek(pickedTeams, perfectTeams)}
                        {/*  //add the total points of all picked teams together */}
                        <br />
                        Your total point: {getTotalPoints(pickedTeams)}
                        {/* //add the total points of all the perfect team together */}
                        <br />
                        Perfect manager total points : {getTotalPoints(perfectTeams)}
                    </div>

                    {getPerfectWeekOverviewMap(pickedTeams)}
                </>
            )}
        </div>
    );
};

export default PerfectManagerUser;