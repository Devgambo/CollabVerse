// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } | null;
      selectedFileId: string | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      files: LiveMap<string, string>;
      whiteboard: LiveList<any>;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        email: string;
        avatar: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { LiveMap, LiveList } from "@liveblocks/client";

// Types for Liveblocks awareness
export type UserAwareness = {
  user: {
    name: string;
    color: string;
    avatar?: string;
  };
};

export type AwarenessList = [number, { user: UserAwareness["user"] }][];

// Define presence for collaboration features
type Presence = {
  cursor: { x: number; y: number } | null;
  selectedFileId: string | null;
};

// Define storage schema if needed
type Storage = {
  files: LiveMap<string, string>;
  whiteboard: LiveList<any>;
};

export const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useOthers,
  useSelf,
  useStorage,
} = createRoomContext<Presence, Storage>(client);
