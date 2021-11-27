import { PartInfo, Parts } from "./types";
import "./PartsDisplay.css"

function PartTile(part : PartInfo, size: string = "150") {
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
        {PartTile(parts.background)}
        {PartTile(parts.body)}
        {PartTile(parts.arms)}
        {PartTile(parts.head)}
        {PartTile(parts.face)}
        {PartTile(parts.headwear)}
        
      </div>
    </div>
  );
}
