import { useMemo, useState } from "react";
import useBlockheadsList, { LoadingState } from "./useBlockheadsList";
import useBlockheadsParts, { partsFields } from "./useBlockheadsParts";
import './GrailBuilder.css';
import GrailBuilderSwapFlow, { GrailState } from "./GrailBuilderSwapFlow";
import placeholderImage from './grail-placeholder.png';
import GrailBuilderPartTile from "./GrailBuilderPartTile";

function GrailPreview({ svgData }: { svgData: string }) {
  return (
    <div
      style={{
        width: 500,
        height: 500,
        backgroundImage: `url(${placeholderImage})`,
        backgroundSize: 'cover',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="500"
        height="500"
        viewBox="0 0 25 25"
        dangerouslySetInnerHTML={{ __html: svgData }}
      />
    </div>
  );
}

export default function GrailBuilder() {
  const [grailState, setGrailState] = useState<GrailState>({
    background: null,
    body: null,
    arms: null,
    head: null,
    face: null,
    headwear: null,
  });
  const { loadingState, tokens } = useBlockheadsList();
  const partsMap = useBlockheadsParts(tokens);
  const [showSwaps, setShowSwaps] = useState(false);

  const canSubmit = useMemo(() => (
    grailState.background &&
    grailState.body &&
    grailState.arms &&
    grailState.head &&
    grailState.face &&
    grailState.headwear
  ), [grailState]);

  const grailPreviewSvg = useMemo(() => {
    return partsFields.map(field => {
      const activeTokenIdForPart = grailState[field];
      return partsMap[activeTokenIdForPart ?? -1]?.[field].svg ?? '';
    }).join('');
  }, [grailState, partsMap]);

  const reviewSwaps = () => {
    setShowSwaps(true);
  };

  if (loadingState !== LoadingState.LOADED) {
    return <div>loading...</div>
  }

  return (
    <div className="grail-builder">
      <div className="grail-builder__tokens">
        {tokens.map(token => {
          console.log(token)
          return (
          <div key={token.tokenId} className="grail-builder__token">
            {!partsMap[token.tokenId]
              ? <h3>Loading parts for Blockhead #{token.tokenId}...</h3>
              : <h3>#{token.tokenId}</h3>
            }

            {partsMap[token.tokenId] && (
              <div className="grail-builder__parts">
                {partsFields.map(part => (
                  <GrailBuilderPartTile
                    key={`${token.tokenId}-${part}`}
                    isSelected={grailState[part] === token.tokenId}
                    label={partsMap[token.tokenId][part].label ?? ''}
                    onClick={() => setGrailState({ ...grailState, [part]: token.tokenId })}
                    svgData={partsMap[token.tokenId][part].svg ?? ''}
                  />
                ))}
              </div>
            )}
          </div>
        )})}
      </div>

      <div className="grail-builder__preview">
        <div className="grail-builder__preview-container">
          <GrailPreview svgData={grailPreviewSvg} />

          <button
            className="connect-button"
            disabled={!canSubmit}
            onClick={reviewSwaps}
          >
            {canSubmit ? 'Review Swaps' : 'Finish building your Blockhead'}
          </button>
        </div>
      </div>

      {showSwaps && (
        <div className="grail-builder__swaps-bg">
          <div className="grail-builder__swaps-modal">
            <GrailBuilderSwapFlow
              grail={grailState}
              tokens={tokens}
            />
          </div>
        </div>
      )}
    </div>
  );
}
