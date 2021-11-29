import { useEffect, useState } from "react";
import { Blockhead } from "./types";
import { useEthers } from "@usedapp/core";
import useBlockheadsContract from "./useBlockheadsContract";
import { fetchBlockhead } from "./BlockheadsUtil";

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

      for (var i = 0; i < balance.toNumber(); i++) {
        const id = await contract.tokenOfOwnerByIndex(targetAccount, i);
        promises.push(fetchBlockhead(id.toNumber(), contract));
      }

      const blockheads = await Promise.all(promises);
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
