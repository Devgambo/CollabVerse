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

  console.log("Auth endpoint: User ID:", user?.id);

  //TODO: also pass room id here
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds: [],
    },
    {
      userInfo: {
        name: user.firstName
          ? user.firstName
          : user.username ||
            user.emailAddresses[0]?.emailAddress ||
            "Anonymous",
        email: user.emailAddresses[0].emailAddress,
        avatar: user.imageUrl,
      },
    },
  );

  return new Response(body, { status });
}
