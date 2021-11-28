import { PartInfo, Parts } from "./types";
import "./PartsDisplay.css"

export function PartTile({ part, size = "150"}: {part : PartInfo, size?: string}) {
    return <div className="part">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin meet"
            viewBox="0 0 25 25"
            width={size}
            height={size}
            dangerouslySetInnerHTML={{ __html: part.svg }}
          />
          <div className="part-label">{part.label}</div>
        </div>
}

export default function PartsDisplay({ parts }: { parts: Parts }) {
  return (
    <div>
      <h1 className="included">Parts Included</h1>
      <div className="part-grid">
        <PartTile part={parts.background} />
        <PartTile part={parts.body} />
        <PartTile part={parts.arms} />
        <PartTile part={parts.head} />
        <PartTile part={parts.face} />
        <PartTile part={parts.headwear} />

      </div>
    </div>
  );
}
