import Navbar from "./components/Navbar";

export default function RootLayout({
    children,
    params,
  }: Readonly<{
    children: React.ReactNode;
    params: { roomId: string };
  }>) {
    return (
      <div>
        <div className=" ">
          <Navbar roomId={params.roomId} />
        </div>
        {children}
      </div>
    );
  }
  

