import { useEffect, useRef, useState } from "react";

export const ShaderCanvas = (props: {
  frag: string;
  setUniforms?: { [key: string]: string | number };
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasStoreRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadCanvas = async () => {
      // @ts-ignore
      const GlslCanvas = await import("glslCanvas");
      const sandbox = new GlslCanvas.default(canvasRef.current);
      sandbox.load(props.frag);
      canvasStoreRef.current = sandbox;
      setLoaded(true);
    };

    loadCanvas();
  }, [props.frag]);

  // apply uniforms
  useEffect(() => {
    if (!loaded) return;

    let sandbox = canvasStoreRef.current;
    if (!sandbox) return;

    for (let k in props.setUniforms) {
      sandbox.setUniform(k, props.setUniforms[k]);
    }
  }, [props.setUniforms, loaded]);

  useEffect(() => {
    const node = canvasRef.current;
    const container = containerRef.current;

    const resizer = (
      canvas: HTMLCanvasElement | null,
      container: HTMLDivElement | null
    ): void => {
      if (!canvas || !container) return;
      canvas.width = container.clientWidth + window.devicePixelRatio;
      canvas.height = container.clientHeight + window.devicePixelRatio;
      canvas.style.width = container.clientWidth + "px";
      canvas.style.height = container.clientHeight + "px";
    };

    resizer(node, container);

    const handler = () => {
      if (!node || !container) return;
      if (
        node.clientWidth !== container.clientWidth ||
        node.clientHeight !== container.clientHeight
      )
        resizer(canvasRef.current, containerRef.current);
    };

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [props.frag, props.setUniforms]);

  return (
    <div
      className={props.className}
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    >
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
