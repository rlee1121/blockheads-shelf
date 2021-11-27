export type Blockhead = {
  tokenId: number;
  tokenURI: string;
  name?: string;
  image?: string; // svg
  attributes?: { [name: string]: string };
};

export type PartInfo = {
  svg: string;
  label: string;
};

export type Parts = {
  background: PartInfo;
  body: PartInfo;
  arms: PartInfo;
  head: PartInfo;
  face: PartInfo;
  headwear: PartInfo;
};

export type PartType = "background" | "body" | "arms" | "head" | "face" | "headwear"

export type Swaps = {[key in PartType] : boolean}
