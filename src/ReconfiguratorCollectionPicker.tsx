import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Blockhead } from "./types";
import { address as contractAddress, ABI } from "./ContractInfo";
import CollectionTile from "./CollectionTile";

export default function ReconfiguratorCollectionPicker({prefix} : {prefix: string}) {
  let { library, account } = useEthers();
  const [loadingState, setLoadingState] = useState(true);
  const [tokens, setTokens] = useState<Blockhead[]>([]);

  useEffect(() => {
    async function effect() {
      if (!account || !library) return;
      const provider = new ethers.providers.Web3Provider(library.provider);
      const contract = new ethers.Contract(contractAddress!, ABI, provider);
      const balance = await contract.balanceOf(account);
      const promises = [];
      async function fetchTokenAtIndex(i: number): Promise<Blockhead> {
        const id = await contract.tokenOfOwnerByIndex(account, i);
        const tokenURI = await contract.tokenURI(id);
        return {
          tokenId: id.toNumber(),
          tokenURI,
        };
      }
      for (var i = 0; i < balance.toNumber(); i++) {
        promises.push(fetchTokenAtIndex(i));
      }
      const blockheads = await Promise.all(promises);
      console.log("Tokens", blockheads);
      setTokens(blockheads);
      setLoadingState(false);
    }
    effect();
  }, [account, library]);

  const loadingMessage = loadingState  && <h3>Loading</h3>;
  const tiles = <div className="tiles">
  {tokens.map((token) => (
    <CollectionTile prefix={prefix} key={token.tokenId} token={token} />
  ))}
</div>
  return <>{loadingMessage}{tiles}</>;
}
