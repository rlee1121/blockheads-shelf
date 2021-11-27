import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchParts } from "./BlockheadsUtil";

import { Parts, PartType, Swaps } from "./types";
import useBlockheadsContract from "./useBlockheadsContract";
import "./Reconfigurator.css";
import { SwapOff, SwapOn } from "./Icons";
import ReconfiguratorCollectionPicker from "./ReconfiguratorCollectionPicker";
import ReconfiguratorTokenView from "./ReconfiguratorTokenView";
import { useContractFunction } from "@usedapp/core";

const InitialSwaps: Swaps = {
  background: false,
  body: false,
  arms: false,
  head: false,
  face: false,
  headwear: false,
};

function anySwaps(swaps: Swaps) {
  return (
    swaps.background ||
    swaps.body ||
    swaps.arms ||
    swaps.head ||
    swaps.face ||
    swaps.headwear
  );
}

export default function Reconfigurator() {
  let { tokenId1, tokenId2 } = useParams<{
    tokenId1?: string;
    tokenId2?: string;
  }>();

  const [parts1, setParts1] = useState<Parts | undefined>();
  const [parts2, setParts2] = useState<Parts | undefined>();
  const [swaps, setSwaps] = useState<Swaps>(InitialSwaps);
  const [sendingSwap, setSendingSwap] = useState(false);
  const [showCautionMessage, setShowCautionMessage] = useState(false);
  const contract = useBlockheadsContract();

  useEffect(() => {
    const lastSwapTimeStr = localStorage.getItem("lastSwapTime");
    if (lastSwapTimeStr) {
      const lastSwapTime = Date.parse(lastSwapTimeStr);
      if (Date.now() - lastSwapTime < 120000) {
        setShowCautionMessage(true);
      }
      localStorage.removeItem("lastSwapTime");
    }
  }, []);

  useEffect(() => {
    async function effect() {
      if (!contract || !tokenId1) return;
      let actualTokenId = tokenId1;
      const minted = await contract.nextTokenId();
      if (actualTokenId >= minted.toNumber()) {
        actualTokenId = minted.toNumber();
      }
      setParts1(await fetchParts(parseInt(actualTokenId!), contract));
    }
    effect();
  }, [contract, tokenId1]);

  useEffect(() => {
    async function effect() {
      if (!contract || !tokenId2) return;
      let actualTokenId = tokenId2;
      const minted = await contract.nextTokenId();
      if (actualTokenId >= minted.toNumber()) {
        actualTokenId = minted.toNumber();
      }
      setParts2(await fetchParts(parseInt(actualTokenId), contract));
    }
    effect();
  }, [contract, tokenId2]);
  // @ts-ignore
  const { send, state } = useContractFunction(contract!, "swapParts");

  const submitSwap = async () => {
    setSendingSwap(true);
    window.onbeforeunload = (e) => {
      localStorage.setItem("lastSwapTime", new Date().toISOString());
      return "Be careful! If you reload this page with a pending swap transaction you will see the previous attributes.  Make sure each swap is done before reloading the page to do the next.";
    };
    await send(
      tokenId1,
      tokenId2,
      swaps.background,
      swaps.body,
      swaps.arms,
      swaps.head,
      swaps.face,
      swaps.headwear
    );
    localStorage.removeItem("lastSwapTime");
    window.onbeforeunload = null;
    setSendingSwap(false);
    window.location.pathname = `/view/${tokenId1}`;
  };

  function swap(part: PartType) {
    return function() {
      setSwaps({ ...swaps, [part]: !swaps[part] });
    };
  }

  function SwapIcon(part: PartType) {
    return swaps[part] ? SwapOn : SwapOff;
  }

  const swapButtons = parts2 && (
    <div className="swap-buttons">
      <div className="swap-button" onClick={swap("background")}>
        {SwapIcon("background")}
      </div>
      <div className="swap-button" onClick={swap("body")}>
        {SwapIcon("body")}
      </div>
      <div className="swap-button" onClick={swap("arms")}>
        {SwapIcon("arms")}
      </div>
      <div className="swap-button" onClick={swap("head")}>
        {SwapIcon("head")}
      </div>
      <div className="swap-button" onClick={swap("face")}>
        {SwapIcon("face")}
      </div>
      <div className="swap-button" onClick={swap("headwear")}>
        {SwapIcon("headwear")}
      </div>
    </div>
  );

  const secondParts = parts1 && parts2 && (
    <ReconfiguratorTokenView
      flip={true}
      parts1={parts2}
      parts2={parts1}
      swaps={swaps}
    />
  );

  const picker = !tokenId2 && (
    <ReconfiguratorCollectionPicker prefix={`/reconfigurator/${tokenId1}/`} />
  );

  const buttonText = {
    None: "Submit Swap Transaction",
    Mining: "Submitting...",
    Exception: "Something went wrong",
    Fail: "Something went wrong",
    Success: "Swapped!",
  }[state.status];
  const submitButton = anySwaps(swaps) && (
    <button
      disabled={sendingSwap}
      className={`submit-swap-button ${state.status}`}
      onClick={submitSwap}
    >
      {buttonText}
    </button>
  );

  const cautionMessage = showCautionMessage && (
    <div>
      Be careful! If you reload this page with a pending swap transaction you
      will see the previous attributes. Make sure each swap is done before
      reloading the page to do the next.
    </div>
  );

  return (
    <div className="reconfigurator-outer">
      <div className="reconfigurator">
        <div className="section">
          <ReconfiguratorTokenView
            flip={false}
            swaps={swaps}
            parts1={parts1}
            parts2={parts2}
          />
        </div>
        {swapButtons}
        <div className="section flip">
          {secondParts}
          {picker}
        </div>
      </div>
      {submitButton}
      {cautionMessage}
    </div>
  );
}
