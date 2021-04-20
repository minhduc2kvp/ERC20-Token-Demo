import './App.css';
import { useState, useEffect } from 'react';


function App() {
  const Web3 = require('web3');
  const ERC20Token = require("./build/ERC20Token.json");
  const contractAddress = "0xD691bE1F642D3532A160725eb5CE87dBB9864dF4";
  let web3, contract, accounts;
  const [symbol, setSymbol] = useState();
  const [total, setTotal] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [value, setValue] = useState(0);

  async function init() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    web3 = window.web3;
    accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    contract = new web3.eth.Contract(ERC20Token.abi, contractAddress);
    await contract.methods.symbol().call().then(result => setSymbol(result));
    await contract.methods.totalSupply().call().then(result => setTotal(web3.utils.fromWei(result)));
    await contract.methods.balanceOf(accounts[0]).call((err, result) => setBalance(web3.utils.fromWei(result)));
  }

  useEffect(() => {
    init();
  });

  function handleChangeAddress(event) {
    setAddress(event.target.value);
  }

  function handleChangeAmount(event) {
    setAmount(event.target.value);
  }

  function handleChangeValue(event) {
    setValue(event.target.value);
  }

  async function transferToken() {
    await contract.methods.transfer(address, web3.utils.toWei(amount.toString())).send({ from: account })
      .then(result => {
        alert(`transfer sucess ${result}`);
        setBalance(balance - amount);
      })
      .catch(err => alert(`transfer error ${err}`));
  }

  async function burnToken() {
    await contract.methods.burn(web3.utils.toWei(value.toString())).send({ from: account })
      .then(result => {
        alert(`burn sucess ${result}`);
        setTotal(total - value);
      })
      .catch(err => alert(`burn error ${err}`));
  }


  return (
    <div className="container">
      <h1 className="text-center">{symbol} Token</h1>
      <div className="text-center">Contract address: {contractAddress}</div>
      <hr/>
      <div className="d-flex justify-content-between">
        <h4 className="text-center">Total: {total} Tokens</h4>
        <div className="d-flex justify-content-between">
          <input type="number" min="0" class="form-control mr-2" id="value" value={value} onChange={handleChangeValue}/>
          <button type="button" class="btn btn-danger" onClick={burnToken}>Burn</button>
        </div>
      </div>
      <hr/>

      <div className="d-flex justify-content-between">
        <h5>Account address: {account}</h5>
        <h5>Balance: {balance} {symbol} Tokens</h5>
      </div>
      <hr/>

      <form>
        <h4 className="text-center">Transfer Token</h4>
        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" class="form-control" id="address" value={address} onChange={handleChangeAddress} />
          <small class="form-text text-muted">Address of account which you'll transfer token</small>
        </div>
        <div class="form-group">
          <label for="amount">Amount</label>
          <input type="number" min="0" class="form-control" id="amount" value={amount} onChange={handleChangeAmount}/>
        </div>
        <button type="button" class="btn btn-primary" onClick={transferToken}>Transfer</button>
      </form>
    </div>
  );
}

export default App;
