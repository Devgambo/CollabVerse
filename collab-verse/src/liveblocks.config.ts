// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data

import { Point, Color, Layer } from "@/src/types/whiteboard";

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | Point | null;
      selectedFileId: string | null;
      selection: string[];
      pencilDraft: [x: number, y: number, pressure: number][] | null;
      penColor: Color | null;
    };

    Storage: {
      files: LiveMap<string, string>;
      layers: LiveMap<string, LiveObject<Layer>>;
      layerIds: LiveList<string>;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        email: string;
        avatar: string;
      };
    };

    // // Custom events, for useBroadcastEvent, useEventListener
    // RoomEvent: {};
    // // Example has two events, using a union
    // // | { type: "PLAY" }
    // // | { type: "REACTION"; emoji: "🔥" };

    // // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    // ThreadMetadata: {
    //   // Example, attaching coordinates to a thread
    //   // x: number;
    //   // y: number;
    // };

    // // Custom room info set with resolveRoomsInfo, for useRoomInfo
    // RoomInfo: {
    //   // Example, rooms with a title and url
    //   // title: string;
    //   // url: string;
    // };
  }
}

import {
  createClient,
  LiveList,
  LiveObject,
  LiveMap,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

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
  cursor: { x: number; y: number } | Point | null;
  selectedFileId: string | null;
  selection: string[];
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
};

// Define storage schema
type Storage = {
  files: LiveMap<string, string>;
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
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
  useMutation,
  useHistory,
  useCanUndo,
  useCanRedo,
  useOthersMapped,
} = createRoomContext<Presence, Storage>(client);
