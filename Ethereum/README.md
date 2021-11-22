# Ethereum Lottery Contract

Simple lottery game using ethereum smart contracts. 


###How the lottery works
- A player must have a metamask wallet and a minimum of 0.2 ETH to enter the lottery

- The Creator of the contract (Manager) is the only one who can to pick a random winner to end the game

- The winner of the lottery will receive all the ETH entered



##Available Scripts
Scripts are supported with env-cmd package. Using the --environments option to read the .env-cmdrc file
https://github.com/toddbluhm/env-cmd#readme

###npm test
Before running any tests. It is required to install and run ganache app. Ganache app sets up an ethereum blockchain environment to execute commands, and inspect state while controlling how the chain operates. 

Ganache - https://www.trufflesuite.com/ganache

###npm deploy
Deploys contract to the Rinkeby network.


## infura - https://infura.io/
Instead of setting up your own ethereum node to deploy a contract. Infura offers an easier solution to deploy 
a contract to the Rinkeby Network.


## Test Network - Rinkeby
https://www.rinkeby.io/#stats

https://rinkeby.etherscan.io/


## Solidity online editor
https://remix.ethereum.org/