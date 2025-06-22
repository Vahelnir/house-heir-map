export type Point = { x: number; y: number };
export type Room = {
  name: string;
  points: Point[];
  color: string;
  label: Point;
};

export { default as rawRooms } from "./rooms.json";

import { default as week1 } from "./maps/week-1.json";

export const weeks: Record<number, { layers: Record<string, string>[] }> = {
  1: week1,
};
