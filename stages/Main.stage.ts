import DeployOnceUponTomorrow from "../ignition/modules/deploy/main/DeployOnceUponTomorrow.ignition";

export default (hre: any, name: string, symbol: string, maxSupply: bigint) => async () => {
  const { onceUponTomorrow } = await hre.ignition.deploy(DeployOnceUponTomorrow, {
    parameters: {
      DeployOnceUponTomorrow: {
        name,
        symbol,
        maxSupply
      },
    },
  });
  return { onceUponTomorrow };
};
