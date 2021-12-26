require("@nomiclabs/hardhat-waffle");
const fs = require('fs')
const privateMetaMaskKey = fs.readFileSync(".secret").toString()

const projectId = "c8b59e2da6264307bdf70ec2ef95c53c"



module.exports = {
  networks : {
    hardhat:  {  chainId: 1337
      },
    mumbai: { url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
            accounts: [privateMetaMaskKey]
      },

    mainnet: {url: `https://mainnet.infura.io/v3/${projectId}`,
              accounts: [privateMetaMaskKey] 
    }
  },
  solidity: "0.8.4"
};



// configure hardhat to work with polygon 


// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

