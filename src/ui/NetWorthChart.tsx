import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PortfolioHistoryPoint } from "../core";
import { COLOR_GREY, COLOR_PANEL, COLOR_TEXT_SECONDARY } from "./common";
import { formatUsd } from "./formatting";

export interface NetWorthChartProps {
  data: PortfolioHistoryPoint[]
}

export const NetWorthChart = ({ data }: NetWorthChartProps) => (
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <XAxis
        dataKey="timestamp"
        tickFormatter={value => `${new Date(value).getMonth()}/${new Date(value).getFullYear().toString().slice(2)}`}
        tickCount={data.length}
        type="number"
        domain={['dataMin', 'dataMax']}
      />
      <YAxis />
      <Tooltip formatter={(value: any) => [formatUsd(value)]} labelFormatter={(value: any) => new Date(value).toLocaleDateString()} />
      <Area type="basisOpen" dot={false} dataKey="totalValue" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"  />
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLOR_GREY} />
    </AreaChart>
  </ResponsiveContainer>
)