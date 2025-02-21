// import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/Nav.jsx";
import Hero from "../hero/hero.jsx";
import NewsSection from "../news/news.jsx";
import Footer from "../footer-page/footer.jsx";
import Feature from "../feature/feature.jsx";

const Home = () => {
  // const navigate = useNavigate();

  return (
    <div>
      <Nav />
      <div id="home">
        <Hero />
      </div>
      <div id="news">
        <NewsSection />
      </div>
      <div id="contact">
        <Feature />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
