

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dash from "./dashboard/Dash";
import Signin from "./auth/Signin";
import Signup from "./auth/Signup";
import Home from "./Home";
export default function App() {
  return (
    <div className="overflow-hidden h-screen">
      {/* <Header /> */}
     
      <Router>
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="/dashboard" element={<Dash />} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>

    </div>
  );
}