// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract SwapFactoryClones is IUniswapV2Factory{  
    address public immutable OWNER;
    address public swapPairImplementation;
    address public override feeTo;
    address public override feeToSetter;
    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    constructor(address _swapPairImplementation, address _feeToSetter) public {
        swapPairImplementation = _swapPairImplementation;
        feeToSetter = _feeToSetter;
        OWNER = msg.sender;
    }

    function allPairsLength() external view override returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external override returns (address pair) {
        require(tokenA != tokenB, "Swap: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "Swap: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "Swap: PAIR_EXISTS"); // single check is sufficient
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        pair = Clones.cloneDeterministic(swapPairImplementation, salt);
        IUniswapV2Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, "Swap: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, "Swap: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
    
    function setImplementation(address _swapPairImplementation) external {
        require(msg.sender == OWNER, "Swap:not allowed");
        swapPairImplementation = _swapPairImplementation;
    }
}