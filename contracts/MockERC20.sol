pragma solidity 0.6.12;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 supply
    ) public ERC20(name, symbol) {
        _mint(msg.sender, supply);
    }
    
    function Mint(address account, uint256 amount) public {
        _mint(account,amount);
    }
}
