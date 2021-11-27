export default function downloadSVG(svg: SVGGraphicsElement) {
  const blob = new Blob([svg.outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  });
  const blobURL = URL.createObjectURL(blob);
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.onload = () => {
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = "blockhead.png";
    a.href = png;
    a.click();
  };
  image.src = blobURL;
}
