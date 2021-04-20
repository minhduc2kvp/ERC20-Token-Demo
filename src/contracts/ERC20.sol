pragma solidity ^0.6.2;

interface ERC20 {

    function totalSupply() external view returns(uint256);
    function balanceOf(address account) external view returns(uint256);
    function allowance(address owner, address spender) external view returns(uint);

    function transfer(address receiver, uint256 amount) external returns(bool);
    function approve(address spender, uint256 amount) external returns(bool);
    function transferFrom(address owner, address receiver, uint256 amount) external returns(bool);
    function burn(uint256 value) external returns(bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address owner, uint256 value);
}