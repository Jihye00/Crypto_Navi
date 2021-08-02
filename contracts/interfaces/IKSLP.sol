// SPDX-License-Identifier: BLUEWHALE-KLAYSWAP
// origin: https://github.com/bluewhale-protocol/bluewhale-trust/contracts

pragma solidity ^0.6.0;

import "./IERC20WithMetadata.sol";

interface IKSLP is IERC20WithMetadata {
    function tokenA() external view returns (address);

    function tokenB() external view returns (address);

    function claimReward() external;

    function estimatePos(address token, uint256 amount)
        external
        view
        returns (uint256);

    function estimateNeg(address token, uint256 amount)
        external
        view
        returns (uint256);

    function addKlayLiquidity(uint256 amount) external payable;

    function addKctLiquidity(uint256 amountA, uint256 amountB) external;

    function removeLiquidity(uint256 amount) external;

    function getCurrentPool() external view returns (uint256, uint256);

    function addKctLiquidityWithLimit(
        uint256 amountA,
        uint256 amountB,
        uint256 minAmountA,
        uint256 minAmountB
    ) external;

    function userRewardSum(address account) external view returns (uint256);
}
