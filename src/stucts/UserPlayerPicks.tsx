import { Pick } from "../stucts/FPLPicks";
import { PlayerType } from "../stucts/FPLData";

export interface PlayerPick {
    name: string,
    points: number,
    pickData: Pick,
    player_type: PlayerType
}

export interface TeamPick {
    week: number,
    totalPoints: number,
    players: PlayerPick[]
}