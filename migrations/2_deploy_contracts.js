const ERC20Token = artifacts.require("ERC20Token");

module.exports = async function(deployer, network, accounts){
    await deployer.deploy(ERC20Token);
}