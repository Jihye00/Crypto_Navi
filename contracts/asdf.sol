pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./IKSLP.sol";
import "./IKSP.sol";

contract Swap {
    address public klayswapFactory = 0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654;
    address public kslp = 0xD83f1B074D81869EFf2C46C530D7308FFEC18036; //0xE75a6A3a800A2C5123e67e3bde911Ba761FE0705;

    constructor() {
        // IERC20(tokenA).approve(kslp, type(uint256).max);
        // IERC20(tokenB).approve(kslp, type(uint256).max);
        // IERC20(ksp).approve(ksp, type(uint256).max);
    }

    receive() external payable {}

    function swap(
        address tokenA,
        address tokenB,
        uint256 amount
    ) public {
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
    }

    function swapklay(address tokenB) public payable {
        address[] memory path = new address[](0);

        //IERC20(0x0000000000000000000000000000000000000000).transferFrom(msg.sender, address(this), msg.value);
        //IERC20(0x0000000000000000000000000000000000000000).approve(klayswapFactory, type(uint256).max);

        uint256 least = 1;
        IKSP(klayswapFactory).exchangeKlayPos{value: msg.value, gas: 1000000}(
            tokenB,
            least,
            path
        );
        uint256 amountOut = IKSLP(kslp).estimatePos(
            0x0000000000000000000000000000000000000000,
            msg.value
        );
        IERC20(tokenB).approve(address(this), type(uint256).max);
        IERC20(tokenB).transferFrom(address(this), msg.sender, amountOut);
    }
}
