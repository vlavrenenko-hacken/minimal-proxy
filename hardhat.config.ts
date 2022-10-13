import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter"

dotenv.config();

const settings = {
  optimizer: {
    enabled: true,
    runs: 200,
  },
};


const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: '0.5.16', settings },
      { version: '0.6.12', settings }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
