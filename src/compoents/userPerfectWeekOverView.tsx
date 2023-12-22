import { useState } from "react";
import { TeamPick } from "../stucts/UserPlayerPicks";
import UserPerfectWeekDeatils from "./userPerfectWeekDetails";
import '../styling/table.css'

interface props {
    userTeam: TeamPick,
    perfectTeam: TeamPick,
}

const UserPerfectWeekOverview = ({ userTeam, perfectTeam }: props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);

    return (
        <>
            <table className="#week-overview-table">
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
                    </tr>
                </tbody>
            </table>
            <button onClick={() => setShowDetails(!showDetails)}>Details</button>
            {showDetails && (
                <UserPerfectWeekDeatils userTeam={userTeam} perfectTeam={perfectTeam} />
            )}
        </>

    );
};

export default UserPerfectWeekOverview;