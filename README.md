# Xsolla Special Initiatives - Solidity Template

## Key Features

* Hardhat Ignition + Hardhat zkSync Deploy integration: possibility of parallel usage.
* Conversion of Hardhat zkSync Deploy scripts into a fixtures.
* Horizontally growing architecture of tasks, stages and fixtures.

## Folders

Every folder except `./contracts` is considered module, so it has to use `export default` operator except those ones that are composed as libraries of methods.

### Descriptions

* `./contract/utils` - Special library of contracts to be able to use reusable Hardhat Ignition modules for TUPS pattern and to be able to quickly deploy and maintain our own mocks.

* `./ignition` - Everything that has to be related with Hardhat Ignition method of deployment and testing.
  * `./ignition/fixtures` - Hardhat Ignition modules that are to be executed only within `loadFixture` in tests agains in memory nodes.
  * `./ignition/modules` - Plain old Hardhat Ignition modules.
  * `./ignition/stages` - Groups of Hardhat Ignition modules that are to be utilized either in `./ignition/fixtures` or in external deployment or other scripts within `./scripts` folder.

* `./zkSync` - Main Hardhat zkSync Deploy folder with deployable through `deploy-zksync` task scripts or stages.
  * `./ignition/fixtures` - zkSync Deploy scripts that are to be utilized only within `inMemoryNode` network. Has to support impersonalization and time travel management.
  * `./ignition/stages` - zkSync Deploy scripts that are composed like building blocks per local artifact to deploy and configure `hardhat-zksync-solc` artifacts.
  
* `./scripts` - A standard folder for external scripts. Most of them are either helper scripts or reusable TypeScript factories for Hardhat Ignition modules or Hardhat zkSync Deploy stages.
  * `./helpers` - General folder where all helper functions are stored. If there to be a new one - it is a required constraint that each and every function accepts all that they need only through the arguments of the function. Please, keep that in mind.
    * `./helpers/eip712` - A scripts for EIP712 signatures manipulation. Specifically through a `ForwardRequest`s of OpenZeppelin Contracts library.
  * `./reusables` - Collections of fabrics for modules or stages.
    * `./ignition` - A collection of Hardhat Ignition modules fabrics to be able to utilize TUPS easy.
    * `./zkSync` - A mock reusable stage fabric for Hardhat zkSync Deploy for demonstration purposes. 

* `./test` - Tests could contain every kind of modules (Hardhat Ignition or Hardhat zkSync Deploy), but they cannot overlap. Please, keep that in mind.

## Commands

No commands that are different from Hardhat Ignition or Hardhat zkSync Deploy were introduced. However there are some new tasks:

* `npx hardhat getAllArtifacts` - Basically gathers a collection of local artifacts and returns it. Commonly is not utilized as is. Only as some helper task.
* `npx hardhat verifyAllZk` - Gathers all locally developed artifacts and tries to verify them against zkSync fork.