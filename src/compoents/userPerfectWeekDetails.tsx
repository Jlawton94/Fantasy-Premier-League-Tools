import { TeamPick } from "../stucts/UserPlayerPicks";
import Team from "./team";

interface props {
    userTeam: TeamPick,
    perfectTeam: TeamPick,
}

const UserPerfectWeekDeatils = ({ userTeam, perfectTeam }: props) => {
    return (
        <table key="Game Week Table">
            <tbody>
                <tr key={`${userTeam.week} : row`}>
                    <td>
                        <Team pickedTeam={userTeam} />
                    </td>
                    <td>
                        <Team pickedTeam={perfectTeam} />
                    </td>
                </tr>
                <tr key={`Point_Diff:${userTeam.week}`}>
                    <td>
                        Point Diff: {perfectTeam.totalPoints - perfectTeam.totalPoints}
                    </td>
                </tr>
            </tbody>
        </table>
    )
};

export default UserPerfectWeekDeatils;