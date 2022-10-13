# Minimal Proxy

This project demonstrates a basic Clones use case. It comes with a couple of contracts named {SwapPairClones(implementation)} and {SwapFactoryClones(the contract deploying the minimal proxy)}, as well as the test for the pair creation. One of the Uniswapv2 contracts was taken and optimized using the minimal proxy. As a result, the gas usage was dramatically decreased

To test the benefits of the minimal proxy and the Clones library, try to execute the tests via hh test. 
The hardhat-gas-reporter was incorporated into the project, so you will be able to see the gas usage. 
