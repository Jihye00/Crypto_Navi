// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IKSP.sol";
import "./interfaces/IKSLP.sol";

import "./interfaces/IDefinixRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NaviSwap {
    event allowed(uint256 allowance);
    event swapped(uint256 amountB);

    address public definixRouter = 0x4E61743278Ed45975e3038BEDcaA537816b66b5B;
    address public WKLAY = 0x5819b6af194A78511c79C85Ea68D2377a7e9335f;

    address public klayswapFactory = 0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654;
    address public kslp = 0xD83f1B074D81869EFf2C46C530D7308FFEC18036;

    struct Swap {
        address _from;
        address _to;
        uint256 _kspAmount;
        uint256 _defAmount;
        address _kspLP;
    }

    address payable public owner;

    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "Definix: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "DefinixRouter: EXPIRED");
        _;
    }

    constructor() {}

    receive() external payable {}

    // input : address _from, address _to, uint _amount
    // return : swapped amount uint of _to token

    //swap tokens other than Klay
    function defSwapKct(
        address tokenA,
        address tokenB,
        uint256 amountA
    ) public returns (uint256 amountB) {
        uint256 deadline = block.timestamp + 5 minutes;
        address[] memory path = new address[](2);

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenA).approve(definixRouter, type(uint256).max);

        uint256[] memory amounts;
        if (tokenB == address(0)) {
            path[0] = tokenA;
            path[1] = WKLAY;
            amounts = IDefinixRouter(definixRouter).swapExactTokensForETH(
                amountA,
                0,
                path,
                msg.sender,
                deadline
            );
        } else {
            path[0] = tokenA;
            path[1] = tokenB;
            amounts = IDefinixRouter(definixRouter).swapExactTokensForTokens(
                amountA,
                0,
                path,
                msg.sender,
                deadline
            );
        }
        emit swapped(amounts[1]);
        return amounts[1];
    }

    // swap Klay
    // tokenA is Klay
    function defSwapKlay(address tokenB, uint256 amountA)
        public
        payable
        returns (uint256 amountB)
    {
        if (msg.value != 0) {
            amountA = msg.value;
        }

        uint256 deadline = block.timestamp + 5 minutes;
        address[] memory path = new address[](2);
        path[0] = WKLAY;
        path[1] = tokenB;

        uint256[] memory amounts;
        amounts = IDefinixRouter(definixRouter).swapExactETHForTokens{
            value: amountA
        }(0, path, msg.sender, deadline);
        emit swapped(amounts[1]);
        return amounts[1];
    }

    // combine definixSwapKct and definixSwapKlay
    // amountA equals msg.value
    function swapDefinix(
        address tokenA,
        address tokenB,
        uint256 amountA
    ) public payable returns (uint256) {
        if (amountA == 0) {
            return 0;
        }

        if (tokenA == address(0)) {
            return defSwapKlay(tokenB, amountA);
        } else {
            return defSwapKct(tokenA, tokenB, amountA);
        }
    }

    // input : address _from, address _to, uint _amount
    // return : swapped amount uint of _to token
    function kspSwapKct(
        address tokenA,
        address tokenB,
        uint256 amount
    ) public returns (uint256) {
        address[] memory path = new address[](0);
        IERC20(tokenA).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenA).approve(klayswapFactory, type(uint256).max);

        uint256 least = 1;
        IKSP(klayswapFactory).exchangeKctPos(
            tokenA,
            amount,
            tokenB,
            least,
            path
        );
        uint256 amountOut = IKSLP(kslp).estimatePos(tokenA, amount);
        IERC20(tokenB).approve(address(this), type(uint256).max);
        IERC20(tokenB).transferFrom(address(this), msg.sender, amountOut);
        return amountOut;
    }

    function kspSwapKlay(address tokenB, uint256 amount)
        public
        payable
        returns (uint256)
    {
        if (msg.value != 0) {
            amount = msg.value;
        }

        address[] memory path = new address[](0);

        uint256 least = 1;
        IKSP(klayswapFactory).exchangeKlayPos{value: amount, gas: 1000000}(
            tokenB,
            least,
            path
        );
        uint256 amountOut = IKSLP(kslp).estimatePos(
            0x0000000000000000000000000000000000000000,
            amount
        );
        IERC20(tokenB).approve(address(this), type(uint256).max);
        IERC20(tokenB).transferFrom(address(this), msg.sender, amountOut);
        return amountOut;
    }

    function swapKlayswap(
        address tokenA,
        address tokenB,
        uint256 amountA,
        address lpAddress
    ) public payable returns (uint256 amountB) {
        if (amountA == 0) {
            return 0;
        }

        kslp = lpAddress;

        if (tokenA == address(0)) {
            return kspSwapKlay(tokenB, amountA);
        } else {
            return kspSwapKct(tokenA, tokenB, amountA);
        }
    }

    function main(Swap[] memory _path) external payable {
        uint256 n = _path.length;
        uint256 kspAmount = _path[0]._kspAmount;
        uint256 defAmount = _path[0]._defAmount;

        for (uint256 i = 0; i < n - 1; i++) {
            uint256 total = 0;
            total =
                total +
                swapKlayswap(
                    _path[i]._from,
                    _path[i]._to,
                    kspAmount,
                    _path[i]._kspLP
                );
            total =
                total +
                swapDefinix(_path[i]._from, _path[i]._to, defAmount);
            kspAmount =
                (total * _path[i + 1]._kspAmount) /
                (_path[i + 1]._kspAmount + _path[i + 1]._defAmount);
            defAmount = total - kspAmount;
        }
        swapKlayswap(
            _path[n - 1]._from,
            _path[n - 1]._to,
            kspAmount,
            _path[n - 1]._kspLP
        );
        swapDefinix(_path[n - 1]._from, _path[n - 1]._to, defAmount);
    }
}
