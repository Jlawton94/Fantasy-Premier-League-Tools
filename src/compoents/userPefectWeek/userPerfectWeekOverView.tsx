import { useState } from "react";
import { TeamPick } from "../../stucts/UserPlayerPicks";
import UserPerfectWeekDeatils from "./userPerfectWeekDetails";
import '../../styling/table.css'

interface props {
    userTeam: TeamPick,
    perfectTeam: TeamPick
}

function correctCaptin(team1: TeamPick, team2: TeamPick) {
    var captin1 = team1.players.filter(player => player.pickData.is_captain).at(0);
    var captin2 = team2.players.filter(player => player.pickData.is_captain).at(0);
    if (captin1?.pickData.element === captin2?.pickData.element) {
        return true
    } else {
        return false
    }
}

const UserPerfectWeekOverview = ({ userTeam, perfectTeam }: props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);

    return (
        <div className="table-container">
            <table className="week-overview-table">
                <tbody>
                    <tr>
                        <th>
                            Week
                        </th>
                        <th>
                            Points
                        </th>
                        <th>
                            Perfect Points
                        </th>
                        <th>
                            Points Lost
                        </th>
                        <th>
                            Transfer Point Spend
                        </th>
                        <th>
                            Correct Captin
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {userTeam.week}
                        </td>
                        <td>
                            {userTeam.totalPoints}
                        </td>
                        <td>
                            {perfectTeam.totalPoints}
                        </td>
                        <td>
                            {perfectTeam.totalPoints - userTeam.totalPoints}
                        </td>
                        <td>
                            {userTeam.transferCost}
                        </td>
                        <td>
                            {correctCaptin(perfectTeam, userTeam) ? "Yes" : "No"}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => setShowDetails(!showDetails)}>Details</button>
            {showDetails && (
                <UserPerfectWeekDeatils userTeam={userTeam} perfectTeam={perfectTeam} />
            )}
        </div>

    );
};

export default UserPerfectWeekOverview;