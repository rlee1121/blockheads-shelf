import { Link } from "react-router-dom";
import { Blockhead } from "./types";

export default function CollectionTile({ token, prefix }: { token: Blockhead, prefix: string }) {
  const tokenURI = token.tokenURI;
  const json = JSON.parse(
    Buffer.from(tokenURI.split(",")[1], "base64").toString()
  );
  const image = Buffer.from(json.image.split(",")[1], "base64").toString();
  const profession = json.attributes.find(
    (attr: any) => attr.trait_type === "Profession"
  ).value;
  const name = json.name.includes("#") ? json.name.split(" ")[1] : json.name;
  return (
    <Link to={prefix + token.tokenId}>
      <div className="collection-tile">
        <div dangerouslySetInnerHTML={{ __html: image }}></div>
        <div className="name">{name}</div>
        <div className="profession">{profession}</div>
      </div>
    </Link>
  );
}
