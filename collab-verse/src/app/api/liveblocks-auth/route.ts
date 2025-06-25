import { Liveblocks } from "@liveblocks/node";
import { currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return new Response("Unauthorized: User ID is missing", { status: 401 });
  }

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user?.firstName || "Unknown",
      nickname: user?.username,
      email: user?.emailAddresses[0]?.emailAddress || "",
      avatar: user?.imageUrl || "",
    },
  });

  // Allow access to rooms - adjust permissions as needed
  session.allow("*", session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
