import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUp from "./views/SignUpPage";
import ItemList from "./views/ItemList";
import Login from "./views/LoginPage";
import Container from "react-bootstrap/Container";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Navbar />
      <Container fluid className="p-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/items"
            element={
              <ProtectedRoutes>
                <ItemList />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoutes>
                <ItemList />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/new-item"
            element={
              <ProtectedRoutes>
                <ItemList />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
