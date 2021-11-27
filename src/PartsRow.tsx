type PartsRowProps = {
  name: string;
  svgs: string[];
  labels: string[];
};
export default function PartsRow(props: PartsRowProps) {
  console.log(props.labels);
  return (
    <div className="PartsRow">
      {props.svgs.map((svg, i) => {
        return (
          <div>
            <svg
              key={props.labels[i] + i}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMin meet"
              viewBox="0 0 25 25"
              width="150"
              height="150"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <div className="label">{props.labels[i]}</div>
          </div>
        );
      })}
    </div>
  );
}
