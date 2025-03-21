import React, { useState, useEffect } from "react";
import Web3 from "web3";

function LandingPage() {
  const [currentaccount, setCurrentaccount] = useState("");

  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);
  const loadWeb3 = async () => {
                try {
                    const ganacheProvider = new Web3.providers.HttpProvider('http://127.0.0.1:7545'); // Local Ganache server
                    window.web3 = new Web3(ganacheProvider);
                } catch (error) {
                    console.error('Error connecting to Ganache:', error);
                    window.alert('Error connecting to the local Ganache server. Please ensure it is running.');
                }
            };
  const loadBlockchaindata = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log(accounts[0]);
    setCurrentaccount(account);
  };
  return (
    <div className="homebg">
      <div className="project-title">
        {" "}
        <h1>Pharmaceutical Supply Chain</h1>
        <span>
          The pharmaceutical supply chain involves the process of sourcing raw
          materials, manufacturing, distributing, and delivering medications to
          consumers.
        </span>
        <br />
        <br />
        <span>
          <b>Current Account Address:</b> {currentaccount}
        </span>
      </div>
    </div>
  );
}

export default LandingPage;