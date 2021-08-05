// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IKSP.sol";
import "./interfaces/IKSLP.sol";
import "./interfaces/IDefinixRouter02.sol";
import "./NaviOptimizer.sol";


contract NaviSwap {
    
    address payable public owner;
    
    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, 'Definix: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }
    
    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'DefinixRouter: EXPIRED');
        _;
    }
    
    address public definixRouterAddress;
    IDefinixRouter02 dfnxRouter;
    
    constructor() public {
        definixRouterAddress = 0x4E61743278Ed45975e3038BEDcaA537816b66b5B;
        dfnxRouter = IDefinixRouter02(definixRouterAddress);
    }
    
    function swapDefinix(
        uint amountIn, 
        uint amountOutMin, 
        address[] memory path, 
        address to, 
        uint deadline
        ) external payable ensure(deadline) returns(uint[] memory amounts) {
            if (path[i] == "0x0000000000000000000000000000000000000000") {
                dfnxRouter.swapExactETHForTokens()
            }
            
            if (path[i+1] == "0x0000000000000000000000000000000000000000") {
                dfnxRouter.swapExactTokensForETH()
            }
            else {
                dfnxRouter.swapExactTokensForTokens()
            }
        }
            
    }

    function swapKlayswap(
        uint amountIn, 
        uint amountOutMin,
        uint address[] memory path,
        address to)
    

    
    
}