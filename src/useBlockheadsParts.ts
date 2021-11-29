import * as ethers from "ethers";
import { useEffect, useState } from "react";
import { fetchParts } from "./BlockheadsUtil";
import { Blockhead } from "./types";
import useBlockheadsContract from "./useBlockheadsContract";

export const partsFields = [
  "background",
  "body",
  "arms",
  "head",
  "face",
  "headwear"
] as const;

export type BlockheadPartType = typeof partsFields[number];
interface PartRenderData {
  svg: string;
  label: string;
}

interface BlockheadRenderData {
  "background": PartRenderData;
  "body": PartRenderData;
  "arms": PartRenderData;
  "head": PartRenderData;
  "face": PartRenderData;
  "headwear": PartRenderData;
}

type PartsState = Record<number, BlockheadRenderData>;

export default function useBlockheadsParts(tokens: Blockhead[]) {
  const contract = useBlockheadsContract();
  const [partsMap, setPartsMap] = useState<PartsState>({});

  useEffect(() => {
    async function fetchPartsForTokens(contract: ethers.Contract) {
      let updatedPartsMap: PartsState = {};

      for (var i = 0; i < tokens.length; i++) {
        const { tokenId } = tokens[i];
        updatedPartsMap[tokenId] = await fetchParts(tokenId, contract);
        setPartsMap({ ...updatedPartsMap });
      }
    }

    if (!contract) {
      return;
    }

    fetchPartsForTokens(contract);
  }, [contract, tokens])

  return partsMap;
}
