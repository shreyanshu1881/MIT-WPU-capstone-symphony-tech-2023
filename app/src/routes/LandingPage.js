import '../style/Style.css';
import NavBar from '.././components/NavBar';
import Footer from '.././components/Footer';
import Hero from '.././components/Hero';

function LandingPage() {
  return (
    <div className="bg-main">
      <Hero />
      <Footer />
    </div>
  );
}

export default LandingPage;
