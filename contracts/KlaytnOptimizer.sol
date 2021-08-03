// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IKSP.sol";
import "./interfaces/IKSLP.sol";
import "./interfaces/IDefinixFactory.sol";
import "./interfaces/IDefinixPair.sol";

contract KlaytnOptimizer {
    struct Pool {
        string dex;
        address poolAddress;
        address tokenA;
        address tokenB;
        uint256 tokenAReserve;
        uint256 tokenBReserve;
        uint256 ratio;
    }

    struct Token {
        address tokenAddress;
        string name;
        string symbol;
        uint8 decimal;
    }
    
    address public klayswapFactoryAddress;
    address public definixFactoryAddress;

    IDefinixFactory dfnxFactory;
    IKSP kswpFactory;
    
    constructor() public {
        klayswapFactoryAddress = 0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654;
        kswpFactory = IKSP(klayswapFactoryAddress);

        definixFactoryAddress = 0xdEe3df2560BCEb55d3d7EF12F76DCb01785E6b29;
        dfnxFactory = IDefinixFactory(definixFactoryAddress);
    }
    
    function getKlayswapPoolList()
        public
        view
        returns (address[] memory poolList)
    {
        uint256 poolCount = kswpFactory.getPoolCount();
        poolList = new address[](poolCount);
        for (uint256 i = 0; i < poolCount; i++) {
            poolList[i] = kswpFactory.getPoolAddress(i);
        }
    }

    function getDefinixPoolList()
        public
        view
        returns (address[] memory poolList)
    {
        uint256 poolCount = dfnxFactory.allPairsLength();
        poolList = new address[](poolCount);
        for (uint256 i = 0; i < poolCount; i++) {
            poolList[i] = dfnxFactory.allPairs(i);
        }
    }

    function getKlayswapPoolInfo(address poolAddress)
        public
        view
        returns (Pool memory)
    {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;

        tokenA = IKSLP(poolAddress).tokenA();
        tokenB = IKSLP(poolAddress).tokenB();
        (reserveA, reserveB) = IKSLP(poolAddress).getCurrentPool();
        
        uint256 reserveApower = reserveA;
        uint256 reserveBpower = reserveB;
        
        uint256 mulratio = reserveBpower*(10**18) / reserveApower;

        return
            Pool("klayswap", poolAddress, tokenA, tokenB, reserveA, reserveB, mulratio);
    }

    function getDefinixPoolInfo(address poolAddress)
        public
        view
        returns (Pool memory)
    {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;

        tokenA = IDefinixPair(poolAddress).token0();
        tokenB = IDefinixPair(poolAddress).token1();
        (reserveA, reserveB, ) = IDefinixPair(poolAddress).getReserves();
        
        uint256 reserveApower = reserveA;
        uint256 reserveBpower = reserveB;
        
        uint256 mulratio = reserveBpower*(10**18) / reserveApower;

        return
            Pool("klayswap", poolAddress, tokenA, tokenB, reserveA, reserveB, mulratio);
    }

    function getAllPoolInfo()
        public
        view
        returns (Pool[] memory result, uint256 time)
    {
        address[] memory klswPoolList = getKlayswapPoolList();
        address[] memory dfnxPoolList = getDefinixPoolList();
        result = new Pool[](klswPoolList.length + dfnxPoolList.length);

        for (uint256 i = 0; i < klswPoolList.length; i++) {
            result[i] = getKlayswapPoolInfo(klswPoolList[i]);
        }

        for (uint256 i = 0; i < dfnxPoolList.length; i++) {
            result[klswPoolList.length + i] = getDefinixPoolInfo(
                dfnxPoolList[i]
            );
        }
        time = now;
    }

    function getTokenInfo(address tokenAddress)
        public
        view
        returns (Token memory)
    {
        if (tokenAddress == address(0)) {
            return Token(tokenAddress, "KLAY", "KLAY", 18);
        } else {
            IERC20WithMetadata TokenContract = IERC20WithMetadata(tokenAddress);
            return
                Token(
                    tokenAddress,
                    TokenContract.name(),
                    TokenContract.symbol(),
                    TokenContract.decimals()
                );
        }
    }

    function getTokensInfo(address[] memory tokenAddressList)
        public
        view
        returns (Token[] memory result)
    {
        result = new Token[](tokenAddressList.length);
        for (uint256 i = 0; i < tokenAddressList.length; i++) {
            result[i] = getTokenInfo(tokenAddressList[i]);
        }
    }
    
}






