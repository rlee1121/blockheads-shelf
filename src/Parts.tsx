
import { useEthers } from "@usedapp/core";
import * as ethers from "ethers";
import { useEffect, useState } from "react";
import { address as contractAddress, ABI } from "./ContractInfo";
import PartsRow from "./PartsRow";
enum LoadingState {
  FETCHING_BALANCE,
  GETTING_TOKEN_IDS,
  DETACHING_PARTS,
  LOADED,
}

function hexToUTF8(hex: string) {
  console.log("Hex", hex, hex.length);
  if (hex.length === 0) return ""
  return decodeURIComponent("%" + hex.match(/.{1,2}/g)!.join("%"));
}

type BlockheadData = {
  bgData: string[];
  bodyData: string[];
  armsData: string[];
  headData: string[];
  faceData: string[];
  headwearData: string[];

  bgLabel: string[];
  bodyLabel: string[];
  armsLabel: string[];
  headLabel: string[];
  faceLabel: string[];
  headwearLabel: string[];
};

const initialData = {
  bgData: [],
  bodyData: [],
  armsData: [],
  headData: [],
  faceData: [],
  headwearData: [],

  bgLabel: [],
  bodyLabel: [],
  armsLabel: [],
  headLabel: [],
  faceLabel: [],
  headwearLabel: [],
};

function cap(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export default function Parts() {
  let { library, account } = useEthers();
//   account = "0x4e392d913A69f74359504A39ED41E5d5FEb53d43"
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.FETCHING_BALANCE
  );
  const [data, setData] = useState<BlockheadData>(initialData);

  useEffect(() => {
    async function effect() {
      if (!library) return
      const provider = new ethers.providers.Web3Provider(library.provider);
      const contract = new ethers.Contract(contractAddress!, ABI, provider);
      const balance = await contract.balanceOf(account);
      setLoadingState(LoadingState.GETTING_TOKEN_IDS);
      const tokens = [];
      console.log("Balance", balance.toNumber());
      for (var i = 0; i < balance.toNumber(); i++) {
        const token = await contract.tokenOfOwnerByIndex(account, i);
        tokens.push(token);
      }
      console.log("Tokens", tokens);
      setLoadingState(LoadingState.DETACHING_PARTS);
      for (var i = 0; i < tokens.length; i++) {
        const fields = ["bg", "body", "arms", "head", "face", "headwear"];
        for (var j = 0; j < fields.length; j++) {
          const field = fields[j];
          let svg: string = await contract[`get${cap(field)}Data`](tokens[i]);
          if (svg.length == 0) continue
          // @ts-ignore
          (data[`${field}Data`] as string[]).push(hexToUTF8(svg.substring(2)));
          let label : string = await contract[`get${cap(field)}Label`](tokens[i]);
          // @ts-ignore
          (data[`${field}Label`] as string[]).push(label);
        }
        console.log("Loaded token", i, data);
        setData(data)
      }
      setLoadingState(LoadingState.LOADED);
    }
    effect();
  }, [account, library]);
  const loadingMessage = {
    [LoadingState.FETCHING_BALANCE]: "Fetching Balance",
    [LoadingState.GETTING_TOKEN_IDS]: "Getting token ids",
    [LoadingState.DETACHING_PARTS]: "Detaching Parts",
    [LoadingState.LOADED]: null,
  }[loadingState];
  console.log("Rendering");
  return (
    <div>
      <h1>Collection</h1>
      {loadingMessage}
      <PartsRow name="Headwear" svgs={data.headwearData} labels={data.headwearLabel} />
      <PartsRow name="Face" svgs={data.faceData} labels={data.faceLabel} />
      <PartsRow name="Head" svgs={data.headData} labels={data.headLabel} />
      <PartsRow name="Arms" svgs={data.armsData} labels={data.armsLabel} />
      <PartsRow name="Body" svgs={data.bodyData} labels={data.bodyLabel} />
      <PartsRow name="Background" svgs={data.bgData} labels={data.bgLabel} />
    </div>
  );
}
