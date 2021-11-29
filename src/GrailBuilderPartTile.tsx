import { PartTile } from './PartsDisplay';

export default function GrailBuilderPartTile({
  isSelected,
  label,
  onClick,
  svgData
}: {
  isSelected: boolean;
  label: string;
  onClick: () => void;
  svgData: string;
}) {
  return (
    <div
      className={`grail-builder__part ${isSelected ? 'grail-builder__part--selected' : ''}`}
      onClick={() => onClick()}
    >
      <PartTile
        part={{ svg: svgData, label }}
        size="75"
      />
    </div>
  )
}
