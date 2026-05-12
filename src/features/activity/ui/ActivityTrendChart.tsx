/**
 * Features/FSD: componente de gráfico de tendência para reaproveitar em Dashboard e Stats.
 */
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

import type { ActivityTrendPoint } from "@/features/activity/lib/activityCalculations";

type Metric = "calories" | "durationMinutes" | "distanceKm";

interface ActivityTrendChartProps {
  title: string;
  data: ActivityTrendPoint[];
  metric: Metric;
  visualization?: "line" | "bar";
}

const metricLabel: Record<Metric, string> = {
  calories: "Calorias",
  durationMinutes: "Minutos",
  distanceKm: "Distância (km)",
};

export const ActivityTrendChart = ({
  title,
  data,
  metric,
  visualization = "line",
}: ActivityTrendChartProps) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
    <header className="mb-3">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{metricLabel[metric]}</p>
    </header>

    <div className="h-72 w-full">
      <VictoryChart
        domainPadding={20}
        height={280}
        padding={{ top: 20, right: 24, bottom: 48, left: 52 }}
        theme={VictoryTheme.clean}
        containerComponent={<VictoryVoronoiContainer />}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#94A3B8" },
            tickLabels: { fontSize: 10, fill: "#64748B" },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#94A3B8" },
            tickLabels: { fontSize: 10, fill: "#64748B" },
            grid: { stroke: "#E2E8F0", strokeDasharray: "4,4" },
          }}
        />

        {visualization === "line" ? (
          <VictoryLine
            interpolation="monotoneX"
            style={{ data: { stroke: "#0284C7", strokeWidth: 3 } }}
            data={data}
            x="label"
            y={metric}
            labels={({ datum }) => `${datum.label}: ${datum[metric]}`}
            labelComponent={<VictoryTooltip />}
          />
        ) : (
          <VictoryBar
            style={{ data: { fill: "#0EA5E9" } }}
            data={data}
            x="label"
            y={metric}
            labels={({ datum }) => `${datum.label}: ${datum[metric]}`}
            labelComponent={<VictoryTooltip />}
          />
        )}
      </VictoryChart>
    </div>
  </section>
);
