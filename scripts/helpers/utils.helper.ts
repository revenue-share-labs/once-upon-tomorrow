import { Contract, EventLog, Log } from "ethers";

export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export const getEventBody = async (eventName: string, contractInstance: Contract, resultIndex = -1) => {
  const filter = contractInstance.filters[eventName]();
  const filterQueryResult: Array<EventLog | Log> = await contractInstance.queryFilter(filter);
  const lastIndex = filterQueryResult.length == 0 ? 0 : filterQueryResult.length - 1;
  return (filterQueryResult[resultIndex == -1 ? lastIndex : resultIndex] as EventLog).args;
}