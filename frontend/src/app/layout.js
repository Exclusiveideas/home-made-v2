import localFont from "next/font/local";
import "./globals.css";
import { Poppins, Caveat_Brush, Playfair_Display, Petit_Formal_Script } from 'next/font/google';
 
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap' })

const caveatBrush = Caveat_Brush({ 
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap' })

const playfairDisplay = Playfair_Display({ 
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap' })

const petitFormalScript = Petit_Formal_Script({ 
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap' })

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Home Made",
  description: "Your Chef, Your Cuisine, Anytime.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${caveatBrush.variable} ${poppins.variable} ${playfairDisplay.variable} ${petitFormalScript.variable}`}>
        {children}
      </body>
    </html>
  );
}
