import { ethers } from "hardhat";

async function main() {
  // Deploying IERC20.sol
  const ERC20Token = await ethers.getContractFactory("IERC20");
  const erc20Token = await ERC20Token.deploy();
  await erc20Token.deployed();
  console.log("ERC20 Token deployed to:", erc20Token.address);

  // Deploying SaveERC20.sol
  const SaveERC20 = await ethers.getContractFactory("SaveERC20");
  const saveERC20 = await SaveERC20.deploy(erc20Token.address);
  await saveERC20.deployed();
  console.log("SaveERC20 deployed to:", saveERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
