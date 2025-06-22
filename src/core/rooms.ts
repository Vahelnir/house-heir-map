export type Point = { x: number; y: number };
export type Room = {
  name: string;
  points: Point[];
  color: string;
  label: Point;
};

export { default as rawRooms } from "./rooms.json";
