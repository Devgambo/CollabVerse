import Navbar from "./components/Navbar";
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { roomId: string };
}>) {
  const { roomId } = await params;

  return (
    <div>
      <div className=" ">
        <Navbar roomId={roomId} />
      </div>
      {children}
    </div>
  );
}
