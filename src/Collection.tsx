import * as ethers from "ethers";
import { useEffect, useState } from "react";
import { Blockhead } from "./types";
import { address as contractAddress, ABI } from "./ContractInfo";
import CollectionTile from "./CollectionTile";
import "./Collection.css";
import { useEthers } from "@usedapp/core";
import Connect from "./Connect";
import { useParams } from "react-router";
enum LoadingState {
  FETCHING_BALANCE,
  GETTING_TOKEN_IDS,
  DETACHING_PARTS,
  LOADED,
}

export default function Collection() {
  let { address } = useParams<{ address?: string }>();
  let { library, account } = useEthers();
  if (address) {
    account = address
  }
  //   account = "0x4e392d913A69f74359504A39ED41E5d5FEb53d43"
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.FETCHING_BALANCE
  );
  const [tokens, setTokens] = useState<Blockhead[]>([]);

  useEffect(() => {
    async function effect() {
      if (!account || !library) return
      const provider = new ethers.providers.Web3Provider(library.provider);
      const contract = new ethers.Contract(contractAddress!, ABI, provider);
      const balance = await contract.balanceOf(account);
      setLoadingState(LoadingState.GETTING_TOKEN_IDS);
      const promises = [];
      async function fetchTokenAtIndex(i: number) : Promise<Blockhead>{
        const id = await contract.tokenOfOwnerByIndex(account, i);
        const tokenURI = await contract.tokenURI(id);
        return {
          tokenId: id.toNumber(),
          tokenURI
        }
      }
      for (var i = 0; i < balance.toNumber(); i++) {
        promises.push(fetchTokenAtIndex(i));
      }
      const blockheads = await Promise.all(promises);
      console.log("Tokens", blockheads);
      setTokens(blockheads);
      setLoadingState(LoadingState.LOADED);
    }
    effect();
  }, [account, library]);

  const loadingMessage =
    loadingState === LoadingState.LOADED ? null : <h3>Loading</h3>;

  if (!account) {
    return <Connect />
  }
  return (
    <div>
      <h1 className="collectionLabel">Collection</h1>
      {loadingMessage}
      <div className="tiles">
        {tokens.map((token) => (
          <CollectionTile prefix="/view/" key={token.tokenId} token={token} />
        ))}
      </div>
    </div>
  );
}
