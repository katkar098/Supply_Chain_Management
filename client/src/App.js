import './App.css';
import Register from './Register';
import LandingPage from './LandingPage';
import OrderMedicine from './OrderMedicine';
import Supply from './Supply'
import Track from './Track'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
function App() {
  return (
    <div className="App">
      <Navbar className='nav-content' bg={window?.location?.pathname === "/" ? "primary" : "primary"} variant="dark">
        <Container>
        <Navbar.Brand 
  href="/" 
  style={{ 
    fontFamily: "'Poppins', sans-serif", 
    fontSize: "28px", 
    fontWeight: "900", 
    letterSpacing: "1px", 
    color: "#ff5733",
    textTransform: "uppercase"
  }}
>
    Medi <span style={{ color: "white", textShadow: "2px 2px 4px rgba(255, 255, 255, 0.6)" }}>Track</span>
</Navbar.Brand>



          <Nav className="me-auto nav-links">
            <Nav.Link href="/register" className={window?.location?.pathname === "/register" ? "active-link" : ""}>Register</Nav.Link>
            <Nav.Link href="/order-medicine" className={window?.location?.pathname === "/order-medicine" ? "active-link" : ""}>Order Medicines</Nav.Link>
            <Nav.Link href="/control-supply-chain" className={window?.location?.pathname === "/control-supply-chain" ? "active-link" : ""}>Control Supply Chain</Nav.Link>
            <Nav.Link href="/track-medicine" className={window?.location?.pathname === "/track-medicine" ? "active-link" : ""}>Track Medicines</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/register" component={Register} />
          <Route path="/order-medicine" component={OrderMedicine} />
          <Route path="/control-supply-chain" component={Supply} />
          <Route path="/track-medicine" component={Track} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
