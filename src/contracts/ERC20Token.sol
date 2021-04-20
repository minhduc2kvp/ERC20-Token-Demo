pragma solidity ^0.6.2;

import "./ERC20.sol";

contract ERC20Token is ERC20 {
    string public constant name = "ERC20 Token Basic";
    string public constant symbol = "ERC";
    uint8 public constant decimals = 18;

    address admin;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    uint256 totalSupply_ = 1000000000000000000000000; // 1 Million

    using SafeMath for uint256;

    constructor () public {
        admin = msg.sender;
        balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public override view returns(uint256) {
        return totalSupply_;
    }

    function balanceOf(address account) public override view returns (uint256){
        return balances[account];
    }

    function transfer(address receiver, uint256 amount) public override returns(bool){
        require(amount <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[receiver] = balances[receiver].add(amount);
        emit Transfer(msg.sender, receiver, amount);
        return true;
    }

    function allowance(address owner, address spender) public override view returns(uint) {
        return allowed[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns(bool) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address owner, address receiver, uint256 amount) public override returns(bool){
        require(amount <= balances[owner]);
        require(amount <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(amount);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(amount);
        balances[receiver] = balances[receiver].add(amount);
        emit Transfer(owner, receiver, amount);
        return true;
    }

    function burn(uint256 value) public override returns(bool) {
        require(msg.sender == admin);
        require(value > 0);
        require(balances[msg.sender] >= value);
        balances[msg.sender] = balances[msg.sender].sub(value);
        totalSupply_ = totalSupply_.sub(value);
        emit Burn(msg.sender, value);
        return true;
    }

}

library SafeMath {

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {

      assert(b <= a);

      return a - b;

    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {

      uint256 c = a + b;

      assert(c >= a);

      return c;

    }

}