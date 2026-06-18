import { useCallback, useState } from "react";
import { Chart, LineSeries } from "lightweight-charts-react-components";
import { NodeViewWrapper } from "@tiptap/react";

const staticChartData = [
  { time: "2023-01-01", value: 100 },
  { time: "2023-01-02", value: 101 },
  { time: "2023-01-03", value: 99 },
  { time: "2023-01-04", value: 104 },
  { time: "2023-01-05", value: 108 },
  { time: "2023-01-06", value: 106 },
  { time: "2023-01-07", value: 112 },
];

const CHART_HEIGHT = 480;

export const ChartBlockView = () => {
  const [width, setWidth] = useState<number | null>(null);

  const setContainerRef = useCallback((element: HTMLDivElement | null) => {
    const parent = element?.parentElement;

    if (!parent) return;

    const width = parent.clientWidth || 480;

    setWidth(width);
  }, []);

  return (
    <NodeViewWrapper className="chart-block" contentEditable={false}>
      <div
        ref={setContainerRef}
        className="rounded-md border border-(--border) overflow-hidden"
        style={{ width: `${width}px`, height: CHART_HEIGHT }}
      >
        {width && (
          <Chart options={{ width, height: CHART_HEIGHT }}>
            <LineSeries data={staticChartData} />
          </Chart>
        )}
      </div>
    </NodeViewWrapper>
  );
};
