import ReconfiguratorPreview from "./ReconfiguratorPreview";
import { PartInfo, Parts, Swaps } from "./types";

type ReconfiguratorTokenViewProps = {
  parts1: Parts | undefined;
  parts2: Parts | undefined;
  swaps: Swaps;
  flip: boolean;
};

function PartTile(part: PartInfo) {
  return (
    <div className="part">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 25 25"
        width="50"
        height="50"
        dangerouslySetInnerHTML={{ __html: part.svg }}
      />
    </div>
  );
}

export default function ReconfiguratorTokenView(
  props: ReconfiguratorTokenViewProps
) {
  let { parts1, parts2, swaps , flip} = props;
  if (!parts1) return null;
  if (!parts2) parts2 = parts1;
  const elements = [
    <ReconfiguratorPreview
      swaps={swaps}
      mainParts={parts1}
      otherParts={parts2 || parts1}
    />,
    <div className="parts">
      {PartTile(swaps.background ? parts2.background : parts1.background)}
      {PartTile(swaps.body ? parts2.body : parts1.body)}
      {PartTile(swaps.arms ? parts2.arms : parts1.arms)}
      {PartTile(swaps.head ? parts2.head : parts1.head)}
      {PartTile(swaps.face ? parts2.face : parts1.face)}
      {PartTile(swaps.headwear ? parts2.headwear : parts1.headwear)}
    </div>,
  ];
  if (flip) elements.reverse()
  return <>{elements}</>;
}
