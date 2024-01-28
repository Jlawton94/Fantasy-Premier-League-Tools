import { useState } from "react";
import { TeamPick } from "../../stucts/UserPlayerPicks";
import UserPerfectWeekDeatils from "./userPerfectWeekDetails";
import '../../styling/table.css'

interface props {
    userTeam: TeamPick,
    perfectTeam: TeamPick
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