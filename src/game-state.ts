import { Positionable } from "./positionable";
import { Shuttle } from "./shuttle";
import { Shot } from "./shot";

export interface GameState {
  shuttle: Positionable<Shuttle>;
  shots: Positionable<Shot>[];
}