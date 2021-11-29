import { useMemo, useState } from "react";
import { PartTile } from "./PartsDisplay";
import useBlockheadsList, { LoadingState } from "./useBlockheadsList";
import useBlockheadsParts, { partsFields } from "./useBlockheadsParts";
import './GrailBuilder.css';
import placeholderImage from './grail-placeholder.png';

interface GrailState {
  bg: number | null;
  body: number | null;
  arms: number | null;
  head: number | null;
  face: number | null;
  headwear: number | null;
}

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
    bg: null,
    body: null,
    arms: null,
    head: null,
    face: null,
    headwear: null,
  });
  const { loadingState, tokens } = useBlockheadsList();
  const partsMap = useBlockheadsParts(tokens);

  const grailPreviewSvg = useMemo(() => {
    return partsFields.map(field => {
      const activeTokenIdForPart = grailState[field];
      return partsMap[activeTokenIdForPart ?? -1]?.[field]?.data ?? '';
    }).join('');
  }, [grailState, partsMap]);


  if (loadingState !== LoadingState.LOADED) {
    return <div>loading...</div>
  }

  return (
    <div className="grail-builder">
      <div className="grail-builder__preview">
        <div className="grail-builder__preview-container">
          <GrailPreview svgData={grailPreviewSvg} />
        </div>
      </div>


      <div className="grail-builder__tokens">
        {tokens.map(token => (
          <div key={token.tokenId} className="grail-builder__token">
            {!partsMap[token.tokenId]
              ? <h3>Loading parts for Blockhead #{token.tokenId}...</h3>
              : <h3>#{token.tokenId} {token.attributes?.["Profession"]}</h3>
            }

            {partsMap[token.tokenId] && (
              <div className="grail-builder__parts">
                {partsFields.map(part => {
                  const isSelected = grailState[part] === token.tokenId;
                  return (
                    <div
                      className={`grail-builder__part ${isSelected ? 'grail-builder__part--selected' : ''}`}
                      key={`${token.tokenId}-${part}`}
                      onClick={() => setGrailState({ ...grailState, [part]: token.tokenId })}
                    >
                      <PartTile
                        part={{
                          svg: partsMap[token.tokenId][part]?.data ?? '',
                          label: partsMap[token.tokenId][part]?.label ?? ''
                        }}
                        size="100"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
