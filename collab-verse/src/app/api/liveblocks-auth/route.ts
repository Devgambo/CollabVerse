import { Liveblocks } from "@liveblocks/node";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return new Response("Unauthorized: User ID is missing", { status: 401 });
  }

  // Liveblocks auth
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds: [],
    },
    {
      userInfo: {
        name:
          user.firstName ||
          user.username ||
          user.emailAddresses[0]?.emailAddress ||
          "Anonymous",
        email: user.emailAddresses[0]?.emailAddress,
        avatar: user.imageUrl,
      },
    },
  );

  return new Response(body, { status });
}
