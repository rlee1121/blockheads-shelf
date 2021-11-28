import * as ethers from "ethers";
import { useEffect, useState } from "react";
import { Blockhead } from "./types";
import { useEthers } from "@usedapp/core";
import useBlockheadsContract from "./useBlockheadsContract";

export enum LoadingState {
  FETCHING_BALANCE,
  GETTING_TOKEN_IDS,
  DETACHING_PARTS,
  LOADED,
}

export default function useBlockheadsList(address?: string) {
  let { account } = useEthers();
  const contract = useBlockheadsContract();

  const targetAccount = address || account;

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.FETCHING_BALANCE
  );
  const [tokens, setTokens] = useState<Blockhead[]>([]);

  useEffect(() => {
    async function effect() {
      if (!targetAccount || !contract) return

      const balance = await contract.balanceOf(targetAccount);
      setLoadingState(LoadingState.GETTING_TOKEN_IDS);

      const promises = [];
      async function fetchTokenAtIndex(i: number, contract: ethers.Contract) : Promise<Blockhead>{
        const id = await contract.tokenOfOwnerByIndex(targetAccount, i);
        const tokenURI = await contract.tokenURI(id);
        return {
          tokenId: id.toNumber(),
          tokenURI
        }
      }
      for (var i = 0; i < balance.toNumber(); i++) {
        promises.push(fetchTokenAtIndex(i, contract));
      }

      const blockheads = await Promise.all(promises);
      console.log("Tokens", blockheads);
      setTokens(blockheads);
      setLoadingState(LoadingState.LOADED);
    }
    effect();
  }, [contract, targetAccount]);

  return {
    account,
    loadingState,
    tokens,
  }
}
