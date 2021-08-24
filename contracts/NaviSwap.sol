// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IKSP.sol";
import "./interfaces/IKSLP.sol";
import "./NaviOptimizer.sol";

import "./interfaces/IDefinixRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract NaviSwap {
    event allowed (uint allowance);
    event swapped (uint amountB);

    address public definixRouter = 0x4E61743278Ed45975e3038BEDcaA537816b66b5B;

    address public WKLAY = 0x5819b6af194A78511c79C85Ea68D2377a7e9335f;

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
    
    constructor() public {
    }
    // input : address _from, address _to, uint _amount
    // return : swapped amount uint of _to token

    //swap tokens other than Klay
    function defSwapKct(address tokenA, address tokenB, uint256 amountA) public returns (uint256 amountB) {
        uint deadline = block.timestamp + 5 minutes;
        address[] memory path = new address[](2);

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenA).approve(definixRouter, type(uint256).max);

        uint[] memory amounts;
        if (tokenB==address(0)) {
            path[0] = tokenA;
            path[1] = WKLAY;
            amounts = IDefinixRouter(definixRouter).swapExactTokensForETH(amountA, 0, path, msg.sender, deadline);
        } else {
            path[0] = tokenA;
            path[1] = tokenB;
            amounts = IDefinixRouter(definixRouter).swapExactTokensForTokens(amountA, 0, path, msg.sender, deadline);
        }
        emit swapped(amounts[1]);
        return amounts[1];
    }

    // swap Klay
    // tokenA is Klay
    function defSwapKlay (address tokenB, uint256 amountA) public returns (uint256 amountB) {
        uint deadline = block.timestamp + 5 minutes;
        address[] memory path = new address[](2);
        path[0] = WKLAY;
        path[1] = tokenB;

        uint[] memory amounts;
        amounts = IDefinixRouter(definixRouter).swapExactETHForTokens{value: amountA}(0, path, msg.sender, deadline);
        emit swapped(amounts[1]);
        return amounts[1];
    }

    // combine definixSwapKct and definixSwapKlay
    // amountA equals msg.value
    function defSwap (address tokenA, address tokenB, uint256 amountA) public payable returns (uint256 amountB) {
        if (tokenA==address(0)) {
            return defSwapKlay(tokenB, amountA);
        } else {
            return defSwapKct(tokenA, tokenB, amountA);
        }
    }

    function getAmountsOut(address tokenA, address tokenB, uint amount) public view returns (uint[] memory amounts) {
        address[] memory path = new address[](2);
        //exclude this case on the front end in advance
        // if (tokenA == tokenB){
        //      //do nothing
        //       uint[] memory nothing = new uint[](2);
        //      return nothing;
        //  } else
        if (tokenA==address(0)) {
            path[0] = WKLAY;
            path[1] = tokenB;
        } else if (tokenB==address(0)) {
            path[0] = tokenA;
            path[1] = WKLAY;
        } else {
            path[0] = tokenA;
            path[1] = tokenB;
        }
        return IDefinixRouter(definixRouter).getAmountsOut(amount, path);
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
        uint kspAmount = _path[0]._kspAmount;
        uint defAmount = _path[0]._defAmount;
        
        for (uint i = 0; i < n - 1; i++) {
            uint total = 0;
            // 그 외의 경우에는 이전 iteration 에서 얻은 amount를 
            // 비율에 따라 나눔 값을 토대로 swap을 진행
            // approve()
            total = total + swapKlayswap(_path[i]._from, _path[i]._to, kspAmount); 
            total = total + swapDefinix(_path[i]._from, _path[i]._to, defAmount);
            kspAmount = total * _path[i + 1]._kspAmount / (_path[i+1]._kspAmount + _path[i+1]._defAmount);
            defAmount = total - kspAmount;
        }
        swapKlayswap(_path[n-1]._from, _path[n-1]._to, kspAmount);
        swapDefinix(_path[n-1]._from, _path[n-1]._to, defAmount);
    }
}