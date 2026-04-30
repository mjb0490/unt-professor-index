import Navbar from "../components/ui/Navbar"; // Move your Navbar file to this folder!
import "../App.css"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* This stays at the top of every page now */}
        <main>{children}</main> 
      </body>
    </html>
  );
}