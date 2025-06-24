import Navbar from "@/src/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>
      {children}
    </div>
  );
}
