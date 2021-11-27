import { Parts, Swaps } from "./types";

type ReconfiguratorPreviewProps = {
    swaps: Swaps,
    mainParts: Parts,
    otherParts: Parts
}

export default function ReconfiguratorPreview(props: ReconfiguratorPreviewProps) {
    const { swaps, mainParts, otherParts} = props;
    const innerSVG = ['background', 'body', 'arms', 'head', 'face', 'headwear'].map(part => {
        // @ts-ignore
        return swaps[part] ? otherParts[part].svg : mainParts[part].svg
    }).join("")

    return <div className="reconfigurator-preview">
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 25 25" dangerouslySetInnerHTML={{__html: innerSVG}}></svg>
    </div>
}