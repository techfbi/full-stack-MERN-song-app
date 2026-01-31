import Navbar from "./Nav";
import SongList from "./Songlist";
import { Routes, Route } from "react-router-dom";
import SongContextProvider from "../../contexts/SongContext";
import About from "./About";
import Contact from "./Contact";

function App() {
  return (
    <div>
      <SongContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<SongList />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </SongContextProvider>
    </div>
  );
}

export default App;
