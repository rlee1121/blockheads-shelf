import { useMemo } from "react";
import { Blockhead } from "./types";
import { BlockheadPartType } from "./useBlockheadsParts";

export type GrailState = Record<BlockheadPartType, number | null>;

// Computing most frequently occuring item in array:
// https://stackoverflow.com/a/1053865/16227668
function mode(array: number[]) {
  if (array.length === 0){
    return null;
  }
  let modeMap: any = {};
  let maxEl = array[0], maxCount = 1;
  for (let i = 0; i < array.length; i++) {
    let el = array[i];
    if (modeMap[el] == null){
      modeMap[el] = 1;
    } else {
      modeMap[el]++;
    }

    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

export default function GrailBuilderSwapFlow({
  grail,
  tokens
}: {
  grail: GrailState,
  tokens: Blockhead[]
}) {
  const { swaps, baseTokenId } = useMemo(() => {
    // Filter out nulls just to be safe, but this flow should
    // only be shown once a grail has been fully assembled
    const tokenIds = Object.values(grail).filter(Boolean) as number[];

    // The most commonly occurring token ID should be the base token
    const baseTokenId = mode(tokenIds);

    const swaps = (Object.keys(grail) as BlockheadPartType[]).reduce(
      (swapsMap: Record<number, BlockheadPartType[]>, key: BlockheadPartType) => {
        const tokenId = grail[key];
        if (!tokenId || tokenId === baseTokenId) {
          return swapsMap;
        }

        swapsMap[tokenId] = (swapsMap[tokenId] || []).concat(key);
        return swapsMap;
      },
      {}
    )

    return {swaps, baseTokenId};
  }, [grail]);

  console.log(swaps, baseTokenId, tokens);
  return (
    <div>
      <h3>Base token: {baseTokenId}</h3>
      <p>{JSON.stringify(swaps, null, 2)}</p>
    </div>
  );
}
