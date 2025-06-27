import Navbar from "@/src/components/Navbar";
import { Providers } from "./LiveblocksProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Providers>{children}</Providers>;
}
