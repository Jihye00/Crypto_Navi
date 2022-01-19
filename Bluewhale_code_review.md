# Bluewhale-trust BaseTrust.sol Code Review

_목적: KLAYswap 유동성 풀 재예치_

## 리뷰 파일

- https://github.com/bluewhale-protocol/bluewhale-trust/blob/master/contracts/BaseTrust.sol#L1-L342

### Solidity Version

- 0.6.0

### 상속

```solidity
contract BaseTrust is ITrust, ERC20, Ownable, ReentrancyGuard
```

- `ITrust`
  - 인터페이스
  - `depositKlay` `deposit` `withdraw` `estimateSupply` `estimateRedeem` `valueOf` `totalValue` `rebalance` 정의되어 있음
- `ReentrancyGuard`
  - Prevents a contract from calling itself, directly or indirectly. Calling a `nonReentrant` function from another `nonReentrant` function is not supported. It is possible to prevent this from happening by making the `nonReentrant` function external, and make it call a `private` function that does the actual work.
  - https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard
  - 위치가 ```contracts/utils/ReentrancyGuard.sol```에서 ```contracts/security/ReentrancyGuard.sol```로 변경

### State Variables

```solidity
address public tokenA;
address public tokenB;

address public klayKspPool;

address public ksp;
address public kslp;

uint256 public fee;
address public teamWallet;
```

- `tokenA` `tokenB`
  - kslp의 A, B에 들어가있는 토큰 종류
- `klayKspPool`
- `ksp` `kslp`
- `fee` `teamWallet`

### Event

```solidity
event FeeChanged(uint256 previousFee, uint256 newFee);
event TeamWalletChanged(address previousWallet, address newWallet);
```

- `FeeChanged`
- `TeamWalletChanged`

### Function

_함수의 순서는 기본 코드의 순서를 따르되 이해하기 쉬운 순서로 임의로 변경함_

- `receive`

  - ```solidity
    receive () payable external {}
    ```

  - ETH(아마 여기서는 KLAY)을 받는 함수

- `_approveToken`

  - ```solidity
    function _approveToken() internal {
        if(tokenA != address(0))
            IERC20(tokenA).approve(kslp, uint256(-1));
        IERC20(tokenB).approve(kslp, uint256(-1));
        IERC20(ksp).approve(ksp, uint256(-1));
    }
    ```

  - tokenA, tokenB를 kslp에게 허용해주고 ksp를 ksp에게 최대치 만큼 허용해준다. \\<!--ksp에게 ksp를 왜 허용해주는지?-->

- `estimateSupply`

  - ```solidity
    function estimateSupply(address token, uint256 amount) public view virtual override returns (uint256) {
        require(token == tokenA || token == tokenB);
    
        uint256 pos = IKSLP(kslp).estimatePos(token, amount);
        uint256 neg = IKSLP(kslp).estimateNeg(token, amount);
    
        return (pos.add(neg)).div(2);
    }
    ```

  - ```kslp```를 ```amount```만큼 ```token```으로 교환하였을 때 나올 금액을 positive 방식과 negative 방식의 평균으로 예측한다.

  - ```estimatePos``` ```estimateNeg``` from klayswap

- `_tokenABalance`

  - ```solidity
    function _tokenABalance() internal view returns (uint256) {
        uint256 balance = (tokenA == address(0))? 
            (payable(address(this))).balance : IERC20(tokenA).balanceOf(address(this));
    
        return balance;
    }
    ```

  - ```tokenA```의 주소가 0이 아니라면 ```payable```을 사용해 잔고를 가져오고, 0이라면(Klay라면) ```balanceOf```를 사용해 잔고를 가져온다.

- `_tokenBBalance`

  - ```solidity
    function _tokenBBalance() internal view returns (uint256) {
        return IERC20(tokenB).balanceOf(address(this));
    }
    ```

  - 현재 주소에서 ```tokenB```의 잔고를 가져온다.

- `_balanceInTrust`

  - ```solidity
    function _balanceInTrust() internal view returns (uint256, uint256){
        uint256 balanceA = _tokenABalance();
        uint256 balanceB = _tokenBBalance();
    
        return (balanceA, balanceB);
    }
    ```

  - 현재 주소에서 ```tokenA```와 ```tokenB```의 잔고를 가져온다.

- `_balanceKSLP`

  - ```solidity
    function _balanceKSLP() internal view returns (uint256){
        return IERC20(kslp).balanceOf(address(this));
    }
    ```

  - 현재 주소에서 ```KSLP```의 잔고를 가져온다.

- `_balanceInKSLP`

  - ```solidity
    function _balanceInKSLP() internal view returns (uint256, uint256) {
        uint256 trustLiquidity = _balanceKSLP();
        uint256 totalLiquidity = IERC20(kslp).totalSupply();
    
        (uint256 poolA, uint256 poolB) = IKSLP(kslp).getCurrentPool();
    
        uint256 balanceA = (poolA.mul(trustLiquidity)).div(totalLiquidity);
        uint256 balanceB = (poolB.mul(trustLiquidity)).div(totalLiquidity);
    
        return (balanceA, balanceB);
    }
    ```

  - 현재 Pool에 예치되어 있는 ```tokenA```와 ```tokenB```의 양에 ```KSLP``` 잔고를 곱하고 전체 ```KSLP``` 유동성을 나누어 A와 B의 잔고를 구한다.

  - 받은 ```KSLP```를 통해 예치되어 있는 토큰을 역산한다.

- `totalValue`

  - ```solidity
    function totalValue() public view virtual override returns (uint256, uint256) {
        (uint256 balAInTrust, uint256 balBInTrust) = _balanceInTrust();
        (uint256 balAInKSLP, uint256 balBInKSLP) = _balanceInKSLP();
    
        return (balAInTrust.add(balAInKSLP), balBInTrust.add(balBInKSLP));
    }
    ```

  - Trust에 있는 잔고와 Pool에 예치되어 있는 잔고를 더해서 리턴해준다.

- `estimateRedeem`\\<!--그래서 이 함수의 역할은? 그리고 BWTP가 뭐하는 건데...-->

  - ```solidity
    function estimateRedeem(uint256 shares) public view virtual override returns (uint256, uint256) {
        uint256 totalBWTP = totalSupply();
        require(shares <= totalBWTP);
    
        (uint256 balanceA, uint256 balanceB) = totalValue();
    
        uint256 estimatedA = (balanceA.mul(shares)).div(totalBWTP);
        uint256 estimatedB = (balanceB.mul(shares)).div(totalBWTP);
    
        return (estimatedA, estimatedB);
    }
    ```

  - BWTP(블루웨일 자체 토큰)

  - ```share``` 수와 Trust와 Pool에 예치되어있는 A와 B의 잔고를 곱하고 BWTP의 전체 양으로 나눈 값을 리턴해준다.

- `valueOf`

  - ```solidity
    function valueOf(address account) public view virtual override returns (uint256, uint256){
        uint256 totalBWTP = totalSupply();
    
        if(totalBWTP == 0)
            return (0, 0);
    
        uint256 shares = balanceOf(account);
    
        (uint256 balanceA, uint256 balanceB) = totalValue();
        
        uint256 valueA = (balanceA.mul(shares)).div(totalBWTP);
        uint256 valueB = (balanceB.mul(shares)).div(totalBWTP);
    
        return (valueA, valueB);
    }
    ```

  - 계좌에 있는 돈을 통해 ```share``` 수를 구하고 Trust와 Pool에 예치되어있는 A와 B의 잔고를 곱하고 BWTP의 전체 양으로 나눈 값을 리턴해준다.

  - ```estimateRedeem``` 함수와 거의 비슷함, ```share``` 수를 구해주는 것만 다름

- `_addLiquidity`

  - ```solidity
    function _addLiquidity(uint256 _amountA, uint256 _amountB) internal {
        if(tokenA == address(0))
            IKSLP(kslp).addKlayLiquidity{value: _amountA}(_amountB);
        else
            IKSLP(kslp).addKctLiquidity(_amountA, _amountB);
    }
    ```

  - 정해진 값의 Liquidity를 추가하는 함수

  - Liquidity를 추가하는 함수가 Klay일 때와 다른 토큰일 때가 다르기 때문에 Klay의 주소(0)을 기준으로 분리한다.

- `_addLiquidityAll`

  - ```solidity
    function _addLiquidityAll() internal {
        uint256 balanceA = _tokenABalance();
        uint256 balanceB = _tokenBBalance();
    
        if(balanceA > 0 && balanceB > 0){
            uint256 estimatedA = estimateSupply(tokenB, balanceB);
            uint256 estimatedB = estimateSupply(tokenA, balanceA);
    
            if(balanceB >= estimatedB)
                _addLiquidity(balanceA, estimatedB);
            else
                _addLiquidity(estimatedA, balanceB);
        }
    }
    ```

  - 지갑에 있는 모든 돈의 Liquidity를 제공하는 함수

  - ```tokenA```와 ```tokenB``` 중 더 적은 것만큼 넣는다.

- ```addLiquidityAll```

  - ```solidity
    function addLiquidityAll() public onlyOwner {
        _addLiquidityAll();
    }
    ```

  - ```_addLiquidityAll```을 ```onlyOwner```로 호출하는 함수

- `_removeLiquidity`

  - ```solidity
    function _removeLiquidity(uint256 _amount) internal {
        uint256 totalLP = _balanceKSLP();
        require(_amount <= totalLP);
        
        IKSLP(kslp).removeLiquidity(_amount);
    }
    ```

  - 제공했던 Liquidity를 뺀다.

- `_claim`

  - ```solidity
    function _claim() internal {
        IKSLP(kslp).claimReward();
    }
    ```

  - ```reward```를 받는 함수

- `claim`

  - ```solidity
    function claim() public onlyOwner {
        _claim();
    }
    ```

  - ```_claim```을 ```onlyOwner```로 호출하는 함수

- **```_teamReward```** \\<!--왜 Klay가 아니라 ether로 되어있는거지?-->

  - ```solidity
    function _teamReward(uint256 earned) internal returns (uint256) {
        uint256 reward = (earned.mul(fee)).div(10000);
    
        address payable owner = payable(owner());
        uint256 ownerKlay = owner.balance; 
    
        //For transaction call fee
        if(ownerKlay < 3 ether) {
            uint256 estimated = IKSLP(klayKspPool).estimatePos(ksp, reward);
            uint256 least = (estimated.mul(99)).div(100);
    
            uint256 beforeKlay = (payable(address(this))).balance;
            address[] memory path = new address[](0);
            IKSP(ksp).exchangeKctPos(ksp, reward, address(0), least, path);
            uint256 afterKlay = (payable(address(this))).balance;
    
            uint256 amount = afterKlay.sub(beforeKlay);
            owner.transfer(amount);
    
            return reward;
        }
        else if(teamWallet != address(0)) {
            IERC20(ksp).transfer(teamWallet, reward);
            return reward;
        }
        return 0;
    }
    ```

  - 개발팀에게 돌아가는 수수료 계산

  - Klay로 바꾸어 송금하도록 함

- `_kspTokenPoolExist`

  - ```solidity
    function _kspTokenPoolExist(address token) internal view returns (bool) {
        try IKSP(ksp).tokenToPool(ksp, token) returns (address pool) {
            return IKSP(ksp).poolExist(pool);
        } catch Error (string memory) {
            return false;
        } catch (bytes memory) {
            return false;
        }
    }
    ```

  - Ksp-token Pool이 존재하는지 확인해주는 함수

- `_estimateBasedKSP`

  - ```solidity
    function _estimateBasedKSP(address token, uint256 amount) internal view returns (uint256) {
        require(token == tokenA || token == tokenB);
    
        if(token == ksp){
            return amount;
        }
    
        if(token == address(0)){
            return IKSLP(klayKspPool).estimateNeg(token, amount);
        } 
        else if(_kspTokenPoolExist(token)) {
            address kspTokenPool = IKSP(ksp).tokenToPool(ksp, token);
            return IKSLP(kspTokenPool).estimateNeg(token, amount);
        }
        else {
            address klayTokenPool = IKSP(ksp).tokenToPool(address(0), token);
    
            uint256 estimatedKlay = IKSLP(klayTokenPool).estimateNeg(token, amount);
            uint256 estimatedKSP = IKSLP(klayKspPool).estimateNeg(address(0), estimatedKlay);
    
            return estimatedKSP;
        }
    }
    ```

  - Klay가 포함될 때와 되지 않을 때 함수가 달라지므로 경우를 나누고, ksp-token 풀이 존재하지 않으면 Klay를 거친다.

  - ```estimateNeg``` 방식으로 얻을 수 있는 KSP를 역산한다.

- `_swap`

  - ```solidity
    function _swap() internal {
        uint256 earned = IERC20(ksp).balanceOf(address(this));
    
    
        if(earned > 0) {
            uint256 balanceA = _tokenABalance();
            uint256 balanceB = _tokenBBalance();
    
    
            uint256 balanceABasedKSP = (tokenA == ksp)? 0 : _estimateBasedKSP(tokenA, balanceA);
            uint256 balanceBBasedKSP = (tokenB == ksp)? 0 : _estimateBasedKSP(tokenB, balanceB);
    
    
            uint256 netEarned = earned.sub(_teamReward(earned));
    
    
            uint256 swapAmount = ((netEarned.sub(balanceABasedKSP)).sub(balanceBBasedKSP)).div(2);
            
            uint256 swapAmountA = swapAmount.add(balanceBBasedKSP);
            uint256 swapAmountB = swapAmount.add(balanceABasedKSP);
    
    
            if(swapAmountA > 0)
                _swapKSPToToken(tokenA, swapAmountA);
            if(swapAmountB > 0)
                _swapKSPToToken(tokenB, swapAmountB);
        }
    }
    ```

  - 번 KSP를 A와 B로 바꾸는 함수

  - $$
    netEarned = balanceOfKSP - \_teamReward \\
    swapAmountA = (netEarned - balanceABasedKSP + balanceBBasedKSP)/2 \\
    swapAmountB = (netEarned - balanceBBasedKSP + balanceABasedKSP)/2
    $$

    \\<!--왜 저런 식이 나오지?-->

- `swap`

  - ```solidity
    function swap() public onlyOwner {
        _swap();
    }
    ```

  - ```_swap```을 ```onlyOwner```로 호출하는 함수

- `rebalance`

  - ```solidity
    function rebalance() public virtual override onlyOwner {
        _claim();
        _swap();
        _addLiquidityAll();
    }
    ```

  - reward를 얻고 swap한 뒤 잔고를 모두 유동성 공급해주는 함수

- `_estimateKSPToToken`

  - ```solidity
    function _estimateKSPToToken(address token, uint256 kspAmount) internal view returns (uint256) {
        require(token == tokenA || token == tokenB);
    
        if(token == ksp){
            return kspAmount;
        }
    
        if(token == address(0)){
            return IKSLP(klayKspPool).estimatePos(ksp, kspAmount);
        } 
        else if(_kspTokenPoolExist(token)) {
            address kspTokenPool = IKSP(ksp).tokenToPool(ksp, token);
            return IKSLP(kspTokenPool).estimatePos(ksp, kspAmount);
        }
        else {
            address klayTokenPool = IKSP(ksp).tokenToPool(address(0), token);
    
            uint256 estimatedKlay = IKSLP(klayKspPool).estimatePos(ksp, kspAmount);
            uint256 estimatedToken = IKSLP(klayTokenPool).estimatePos(address(0), estimatedKlay);
            return estimatedToken;
        }
    }
    ```

  - ```KSP```를 Token으로 환산하였을 때 나오는 금액을 계산

  - Klay가 포함될 때 함수가 달라지고, Pool이 존재하지 않으면 Klay를 거쳐가기 때문에 여러 케이스로 분리한다.

- **`_swapKSPToToken`**

  - ```solidity
    function _swapKSPToToken(address token, uint256 amount) internal {
        if(token == ksp)
            return;
        
        address[] memory path;
        if(_kspTokenPoolExist(token)){
            path = new address[](0);
        } else {
            path = new address[](1);
            path[0] = address(0);
        }
        
        uint256 least = (_estimateKSPToToken(token, amount).mul(99)).div(100);
        IKSP(ksp).exchangeKctPos(ksp, amount, token, least, path);
    }
    ```

  - ```KSP```를 다른 토큰으로 바꾸는 함수

  - 풀이 존재하면 ~ 존재하지 않으면 ~ \\<!--뭘 어떻게 선언한거지?-->

  - ```exchangeKctPos(tokenA, amountA, tokenB, amountB, path)``` from Klayswap

    - ```amountB```: minimum amount of token

- `setFee`

  - ```solidity
    function setFee(uint256 _fee) public onlyOwner {
        require(0 <= _fee && _fee <= 10000);
        require(_fee != fee);
        emit FeeChanged(fee, _fee);
        fee = _fee;
    }
    ```

  - TeamReward에서 가져갈 fee를 세팅한다.

- `setTeamWallet`

  - ```solidity
    function setTeamWallet(address _teamWallet) public onlyOwner {
        require(_teamWallet != address(0));
        require(_teamWallet != teamWallet);
        emit TeamWalletChanged(teamWallet, _teamWallet);
        teamWallet = _teamWallet;
    }
    ```

  - TeamReward를 가져갈 지갑 주소를 세팅한다.

- `deposit`

  - ```solidity
    function deposit(uint256 amountA, uint256 amountB) external virtual override { }
    ```

- `depositKlay`

  - ```solidity
    function depositKlay(uint256 _amount) external payable virtual override { }
    ```

- `withdraw`

  - ```solidity
    function withdraw(uint256 _shares) external virtual override { }
    ```