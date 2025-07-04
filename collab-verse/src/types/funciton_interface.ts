import { Id } from "@/convex/_generated/dataModel";
import { Room } from "@/src/types/core_interface";
import { RoomAccesses, RoomPermission } from "@liveblocks/node";

export interface RoomData extends Room {
  liveblocks: {
    type: "room";
    id: string;
    createdAt: Date;
    lastConnectionAt?: Date | undefined;
    defaultAccesses: RoomPermission;
    usersAccesses: RoomAccesses;
    groupsAccesses: RoomAccesses;
    metadata: {
      name: string;
      ownerId: string;
      createdAt: string;
    };
  };
}

export interface RoomUsers {
  _id: string;
  user: {
    name: string;
    email: string;
  } | null;
  _creationTime: number;
  permissions?: ("read" | "write")[] | undefined;
  userId: string;
  roomId: Id<"rooms">;
  role: "mentor" | "owner" | "student" | "collaborator";
  lastActiveAt: number;
  joinedAt: number;
}
