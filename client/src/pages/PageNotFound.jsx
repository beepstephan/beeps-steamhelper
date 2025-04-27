import { Typewriter } from "react-simple-typewriter";
import { Header, Footer } from "../components";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <>
      <Header />
      <div className="bg-animated-gradient pt-16 min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">
          <Typewriter
            words={["404"]}
            loop={1}
            cursor
            cursorStyle="_"
            typeSpeed={50}
            delaySpeed={100}
          />
        </h1>
        <p className="text-gray-300 text-lg mb-6">Сторінку не знайдено!</p>
        <Link
          to="/"
          className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Повернутися на головну
        </Link>
      </div>
      <Footer />
    </>
  );
};