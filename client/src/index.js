import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


ReactDOM.render(
  <React.StrictMode>
    <App />
    {window?.location?.pathname !== "/" && <footer className="footer">
      <div>@2025 Copyright : BlockChain Project</div>
      <div>Developed By : Shubham and Company</div>
    </footer>}
  </React.StrictMode>,
  document.getElementById('root')
);

