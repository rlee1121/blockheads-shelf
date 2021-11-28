import * as ethers from "ethers";
import { useEffect, useState } from "react";
import { Blockhead } from "./types";
import useBlockheadsContract from "./useBlockheadsContract";

export const partsFields = [
  "bg" as const,
  "body" as const,
  "arms" as const,
  "head" as const,
  "face" as const,
  "headwear" as const
];

interface PartRenderData {
  data: string;
  label: string;
}

interface BlockheadRenderData {
  "bg": PartRenderData | null;
  "body": PartRenderData | null;
  "arms": PartRenderData | null;
  "head": PartRenderData | null;
  "face": PartRenderData | null;
  "headwear": PartRenderData | null;
}

function hexToUTF8(hex: string) {
  // console.log("Hex", hex, hex.length);
  if (hex.length === 0) return ""
  return decodeURIComponent("%" + hex.match(/.{1,2}/g)!.join("%"));
}

function cap(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

type PartsState = Record<number, BlockheadRenderData>;

export default function useBlockheadsParts(tokens: Blockhead[]) {
  const contract = useBlockheadsContract();
  const [partsMap, setPartsMap] = useState<PartsState>({});

  useEffect(() => {
    async function fetchParts(contract: ethers.Contract) {
      let updatedPartsMap: PartsState = {};

      for (var i = 0; i < tokens.length; i++) {
        const { tokenId } = tokens[i];
        updatedPartsMap[tokenId] = {
          "bg": null,
          "body": null,
          "arms": null,
          "head": null,
          "face": null,
          "headwear": null
        };

        for (var j = 0; j < partsFields.length; j++) {
          const part = partsFields[j];

          const partSvgData: string = await contract[`get${cap(part)}Data`](tokenId);
          if (partSvgData.length === 0) continue;

          let label: string = await contract[`get${cap(part)}Label`](tokenId);

          updatedPartsMap[tokenId][part] = {
            data: partSvgData.length === 0 ? '' : hexToUTF8(partSvgData.substring(2)),
            label,
          }
        }
        console.log("Loaded token", i);
        setPartsMap({...updatedPartsMap});
      }
    }

    if (!contract) {
      return;
    }

    fetchParts(contract);
  }, [contract, tokens])

  return partsMap;
}
