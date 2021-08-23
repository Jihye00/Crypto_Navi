// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IKSP.sol";
import "./interfaces/IKSLP.sol";
import "./interfaces/IDefinixRouter02.sol";
import "./NaviOptimizer.sol";


contract NaviSwap {
    struct Swap {
        address from;
        address to;
        uint kspAmount;
        uint defAmount;
    }

    mapping (uint => Swap) Path;

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
    // input : address _from, address _to, uint _amount
    // return : swapped amount uint of _to token
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

    // input : address _from, address _to, uint _amount
    // return : swapped amount uint of _to token
    function swapKlayswap(
        uint amountIn, 
        uint amountOutMin,
        uint address[] memory path,
        address to) {

        }

    function addSwap (
        address _from,
        address _to,
        uint _kspAmount,
        uint _defAmount
    ) external payable returns(Swap){
        return new Swap(_from, _to, _kspAmount, _defAmount);
    }
    // 각 swapKlayswap 이랑 swapDefinix 에서 수량이 0 이라면 그냥 0을 리턴해주어야함
    function main(Swap[] _path) external payable {
        uint n = _path.length;
        uint kspAmount;
        uint defAmount;
        uint total = 0;

        total = total + swapKlayswap(_path[0]._from, _path[0]._to, _path[0]._kspAmount); 
        total = total + swapDefinix(_path[0]._from, _path[0]._to, _path[0]._defAmount);
        for (uint i = 1; i < n; i++) {
            total = 0;
            // 그 외의 경우에는 이전 iteration 에서 얻은 amount를 
            // 비율에 따라 나눔 값을 토대로 swap을 진행
            // approve()
            total = total + swapKlayswap(_path[0]._from, _path[0]._to, _path[0]._kspAmount); 
            total = total + swapDefinix(_path[0]._from, _path[0]._to, _path[0]._defAmount);
        }
    }
}