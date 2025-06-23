export type Point = { x: number; y: number };
export type Room = {
  name: string;
  points: Point[];
  color: string;
  label: Point;
};

export type MapLayer = (Room["name"] | null)[][];
export type ManorMap = { layers: MapLayer[] };

export { default as rawRooms } from "./rooms.json";

import { default as week1 } from "./maps/week-1.json";

export const weeks: Record<number, ManorMap> = {
  1: week1,
};
