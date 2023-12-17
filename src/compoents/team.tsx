import { TeamPick } from "../stucts/UserPlayerPicks"

interface props {
    pickedTeam: TeamPick
}

const Team = ({ pickedTeam }: props) => {

    return (
        <table>
            <tbody>
                <tr>
                    <th>Picked Team Week {pickedTeam.week} - Total Points {pickedTeam.totalPoints}</th>
                </tr>
                {pickedTeam.players.map(function (player, j) {
                    return (

                        <tr key={`${player.pickData.element} : ${pickedTeam.week}}`}>
                            <th>{player.name}</th>
                            <td>
                                {player.points * player.pickData.multiplier}
                            </td>
                            <td>
                                {player.pickData.is_captain ? "captin" : ""} {player.pickData.is_vice_captain ? "vice-captin" : ""}
                            </td>
                            <td>
                                {player.player_type?.plural_name_short}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
};

export default Team;