import { Noto_Sans, Noto_Sans_Ethiopic } from "next/font/google";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-ethiopic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export { notoSans, notoEthiopic };
