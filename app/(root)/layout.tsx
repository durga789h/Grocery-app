import Footer from "../_components/Footer";
import Header from "../_components/Header";


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div lang="en">
        <Header/>
        <main>
        
          {children}
          <Footer/>
      </main>
     
      </div>
    );
  }
  