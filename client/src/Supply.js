import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function Supply() {
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, []);

    const [currentAccount, setCurrentAccount] = useState("");
    const [loader, setLoader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState(null);
    const [MED, setMED] = useState([]);
    const [MedStage, setMedStage] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);

    const loadWeb3 = async () => {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Connect to Ganache
            window.web3 = web3;
        } catch (error) {
            console.error("Error loading Web3: ", error);
        }
    };

    const loadBlockchaindata = async () => {
        setLoader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SupplyChainABI.networks[networkId];

        if (deployedNetwork) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, deployedNetwork.address);
            setSupplyChain(supplychain);

            const rmsId = await supplychain.methods.RMSMap(accounts[0]).call();
            setIsRegistered(rmsId > 0);

            const medCtr = await supplychain.methods.medicineCtr().call();
            let medData = [];
            let stageData = [];

            for (let i = 1; i <= medCtr; i++) {
                const med = await supplychain.methods.MedicineStock(i).call();
                const stage = await supplychain.methods.showStage(i).call();
                medData.push(med);
                stageData.push(stage);
            }

            setMED(medData);
            setMedStage(stageData);
        } else {
            alert('Smart contract not deployed on this network.');
        }
        setLoader(false);
    };

    const registerRMS = async () => {
        try {
            const receipt = await SupplyChain.methods.addRMS(currentAccount, "RMS Name", "RMS Location").send({
                from: currentAccount,
                gas: 6000000
            });
            console.log("RMS Registered:", receipt);
            setIsRegistered(true);
        } catch (err) {
            console.error(err);
            alert("Error in RMS registration!");
        }
    };

    const handleTransaction = async (method, ID) => {
        try {
            const receipt = await SupplyChain.methods[method](ID).send({ from: currentAccount, gas: 6000000 });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("Transaction failed!");
        }
    };

    if (loader) {
        return (
            <div className="spinner-button">
                <Button variant="primary" disabled>
                    <Spinner animation="grow" size="sm" role="status" aria-hidden="true" />
                    Loading...
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="mb-3">
                {!isRegistered ? (
                    <Button variant="primary" onClick={registerRMS}>Register as RMS</Button>
                ) : (
                    <h5>Welcome, RMS User</h5>
                )}
            </div>
            <div class="progressbar-wrapper m-20">
                <ul class="progressbar">
                    <li class="active">Medicine Order</li>
                    <li class="active">Raw Material Supplier</li>
                    <li class="active">Manufacturer</li>
                    <li class="active">Distributor</li>
                    <li class="active">Retailer</li>
                </ul>
            </div>

            <Table responsive="sm">
                <thead>
                    <tr>
                        <th>Medicine ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Composition</th>
                        <th>Quantity</th>
                        <th>Current Stage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {MED.map((med, index) => (
                        <tr key={index}>
                            <td>{med.id}</td>
                            <td>{med.name}</td>
                            <td>{med.description}</td>
                            <td>{med.compositions}</td>
                            <td>{med.quantity}</td>
                            <td>{MedStage[index]}</td>
                            <td>
                                {MedStage[index] === "Medicine Ordered" && 
                                    <Button variant="outline-success" size="sm" onClick={() => handleTransaction("RMSsupply", med.id)}>Supply</Button>}
                                {MedStage[index] === "Raw Material Supplied" && 
                                    <Button variant="outline-success" size="sm" onClick={() => handleTransaction("Manufacturing", med.id)}>Manufacture</Button>}
                                {MedStage[index] === "Manufacturing" && 
                                    <Button variant="outline-success" size="sm" onClick={() => handleTransaction("Distribute", med.id)}>Distribute</Button>}
                                {MedStage[index] === "Distribution" && 
                                    <Button variant="outline-success" size="sm" onClick={() => handleTransaction("Retail", med.id)}>Retail</Button>}
                                {MedStage[index] === "Retail" && 
                                    <Button variant="outline-success" size="sm" onClick={() => handleTransaction("sold", med.id)}>Sell</Button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default Supply;