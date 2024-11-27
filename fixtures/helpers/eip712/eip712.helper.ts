import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

import types from './eip712Types.helper';

async function getDomain(contract: any) {
  const { fields, name, version, chainId, verifyingContract, salt, extensions } = await contract.eip712Domain();

  if (extensions.length > 0) {
    throw Error('Extensions not implemented');
  }

  const domain: any = {
    name,
    version,
    chainId,
    verifyingContract,
    salt,
  };

  for (const [i, { name }] of types.EIP712Domain.entries()) {
    if (!(fields & (1 << i))) {
      delete domain[name];
    }
  }

  return domain;
}

function domainType(domain: any) {
  return types.EIP712Domain.filter((params: any) => domain[params.name] !== undefined);
}

function hashTypedData(hre: any, domain: any, structHash: any) {
  return hre.ethers.solidityPackedKeccak256(
    ['bytes', 'bytes32', 'bytes32'],
    ['0x1901', hre.ethers.TypedDataEncoder.hashDomain(domain), structHash],
  );
}

const getRequestAndParams = async (
  forwarder: any,
  amount: bigint,
  paymentToken: string,
  collection: string,
  buyer: SignerWithAddress,
  seller: SignerWithAddress,
  deadline: bigint,
  destinationCellCollection: string,
  randomBytes: any,
  domain: any,
  forwardRequestTypes: any,
  tokenId: bigint = 1n,
  destinationCellTokenId: bigint = 2n,
  destinationStorageCompanyId: bigint = 123n,
  gasLimit: bigint = 100000n,
  value: bigint = 0n,
  customFromAddr: string | undefined = undefined,
) => {
  const buyerAddr = await buyer.getAddress();
  const params = {
    amount,
    paymentToken,
    tokenId,
    collection,
    buyer: customFromAddr === undefined ? buyerAddr : customFromAddr,
    seller: await seller.getAddress(),
    destinationCellCollection,
    destinationCellTokenId,
    destinationStorageCompanyId,
  };
  const rawRequest = await forwarder.wrapIntoForwardRequestData(buyerAddr, deadline, gasLimit, value, params, randomBytes(1));
  const request: any = {
    from: rawRequest[0],
    to: rawRequest[1],
    value: rawRequest[2],
    gas: rawRequest[3],
    nonce: await forwarder.nonces(buyerAddr),
    deadline: rawRequest[4],
    data: rawRequest[5],
  };
  request.signature = await buyer.signTypedData(domain, forwardRequestTypes, request);
  return {
    request,
    params,
  };
};

export default {
  getDomain,
  domainType,
  domainSeparator: async (hre: any) => hre.ethers.TypedDataEncoder.hashDomain,
  hashTypedData,
  types,
  getRequestAndParams,
};
