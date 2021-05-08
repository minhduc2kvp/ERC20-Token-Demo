import './App.css';
import { useState, useEffect } from 'react';


const Web3 = require('web3');
const ERC20Token = require("./build/ERC20Token.json");
const contractAddress = "0xD691bE1F642D3532A160725eb5CE87dBB9864dF4";
let web3, contract, accounts;
const Connect = window.uportconnect;
const uport = new Connect('ERC20 Token', {
  network: "ropsten"
});

function App() {
  const [symbol, setSymbol] = useState();
  const [total, setTotal] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [value, setValue] = useState(0);
  const [addressApproval, setAddressApproval] = useState("");
  const [amountApproval, setAmountApproval] = useState(0);
  const [addressOwner, setAddressOwner] = useState("");
  const [addressReceiver, setAddressReceiver] = useState("");
  const [amountTransfer, setAmountTransfer] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  async function login(){
    web3 = new Web3(uport.getProvider());
    contract = new web3.eth.Contract(ERC20Token.abi, contractAddress);

    await uport.requestDisclosure({ requested: ['name', 'avatar'],notifications: true });
    await uport.onResponse('disclosureReq').then(res => {
      console.log(res);
      setName(res.payload.name);
      setAvatar(res.payload.avatar.uri);
    });
  
    await init();
  }

  async function logout(){
    await uport.logout();
    await init();
  }

  async function init() {
    accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    await contract.methods.symbol().call().then(result => setSymbol(result));
    await contract.methods.totalSupply().call().then(result => setTotal(web3.utils.fromWei(result)));
    await contract.methods.balanceOf(accounts[0]).call((err, result) => setBalance(web3.utils.fromWei(result)));
  }

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
        alert(`transfer success ${result}`);
        console.log(result);
        setBalance(balance - amount);
      })
      .catch(err => alert(`transfer error ${err}`));
  }

  async function burnToken() {
    await contract.methods.burn(web3.utils.toWei(value.toString())).send({ from: account })
      .then(result => {
        alert(`burn success ${result}`);
        setTotal(total - value);
      })
      .catch(err => alert(`burn error ${err}`));
  }

  async function approveToken() {
    await contract.methods.approve(addressApproval, web3.utils.toWei(amountApproval.toString())).send({ from: account })
      .then(result => {
        alert(`approve success ${result}`);
      })
      .catch(err => alert(`approve error ${err}`));
  }

  async function transferTokenFrom() {
    await contract.methods.transferFrom(addressOwner, addressReceiver, web3.utils.toWei(amountTransfer.toString())).send({ from: account })
      .then(result => {
        alert(`transfer sucess ${result}`);
      })
      .catch(err => alert(`transfer error ${err}`));
  }


  return (
    <div className="container">
      <h1 className="text-center">{symbol} Token</h1>
      <div className="text-center">Contract address: {contractAddress}</div>
      
      <hr/>

      <div className="d-flex justify-content-between">
        <div>
          <img width="50" src={avatar} className="rounded mr-2"/>
          <span>{name}</span>
          <button type="button" class={name !== "" ? "btn btn-danger ml-2" : "d-none"} onClick={logout}>Logout Uport</button>
        </div>
        <button type="button" class="btn" style={{backgroundColor: "#651fff", color: "white"}} onClick={login}>Uport Login</button>
      </div>
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

      <div className="row">
        <form className="col-6">
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

        <form className="col-6">
          <h4 className="text-center">Approve User</h4>
          <div class="form-group">
            <label for="address-approval">Address</label>
            <input type="text" class="form-control" id="address-approval" value={addressApproval} onChange={(event) => setAddressApproval(event.target.value)} />
            <small class="form-text text-muted">Address of account which you'll approve use your token</small>
          </div>
          <div class="form-group">
            <label for="amount-approval">Amount</label>
            <input type="number" min="0" class="form-control" id="amount-approval" value={amountApproval} onChange={(event) => setAmountApproval(event.target.value)}/>
          </div>
          <button type="button" class="btn btn-primary" onClick={approveToken}>Approve</button>
        </form>
      </div>
      
      <hr/>

      <form>
        <h4 className="text-center">Transfer Token From Owner</h4>
        <div class="form-group">
          <label for="address-owner">Address Owner</label>
          <input type="text" class="form-control" id="address-owner" value={addressOwner} onChange={(event) => setAddressOwner(event.target.value)} />
          <small class="form-text text-muted">Address of account which you'll get token to transfer</small>
        </div>
        <div class="form-group">
          <label for="address-receiver">Address Receiver</label>
          <input type="text" class="form-control" id="address-receiver" value={addressReceiver} onChange={(event) => setAddressReceiver(event.target.value)} />
          <small class="form-text text-muted">Address of account which you'll transfer token</small>
        </div>
        <div class="form-group">
          <label for="amount-transfer">Amount</label>
          <input type="number" min="0" class="form-control" id="amount-transfer" value={amountTransfer} onChange={(event) => setAmountTransfer(event.target.value)}/>
        </div>
        <button type="button" class="btn btn-primary" onClick={transferTokenFrom}>Transfer</button>
      </form>

      <hr/>
    </div>
  );
}

export default App;
