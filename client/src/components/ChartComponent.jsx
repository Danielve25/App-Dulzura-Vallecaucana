import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ChartComponent({
  chartData,
  chartConfig,
  defaultTimeRange = "90d",
  chartTitle,
  chartDescription,
  lineType,
  className,
}) {
  const [timeRange, setTimeRange] = useState(defaultTimeRange);

  // Filtramos los datos según el rango de tiempo seleccionado
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(
      chartData[chartData.length - 1]?.date || new Date()
    );
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Renderizamos las áreas de acuerdo a las claves de los datos (por ejemplo, desktop, mobile, etc.)
  const renderAreas = () => {
    return Object.keys(chartConfig).map((key) => {
      const { color, label } = chartConfig[key];
      return (
        <Area
          dot={true}
          key={key}
          dataKey={key}
          type={lineType}
          fill={`url(#fill${key})`}
          stroke={color}
          stackId="a"
        />
      );
    });
  };

  // Renderizamos los gradientes para cada clave
  const renderGradients = () => {
    return Object.keys(chartConfig).map((key) => {
      const { color } = chartConfig[key];
      return (
        <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.8} />
          <stop offset="95%" stopColor={color} stopOpacity={0.1} />
        </linearGradient>
      );
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>{chartDescription}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto border-black"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white">
            <SelectItem value="90d" className="rounded-lg">
              ultimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              ultimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              ultimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>{renderGradients()}</defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              className="bg-white"
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {renderAreas()}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartComponent;
