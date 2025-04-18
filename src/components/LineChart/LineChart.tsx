import React, { useEffect, useMemo, useState } from "react";
import { useGetBalanceChartQuery, useGetWalletsQuery } from "src/store/analytics/analyticsAPI";  // Import RTK queries

import Select from "src/components/Select/Select";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import styles from "./LineChart.module.scss";

interface LineChartProps {
    color?: string;
    selectValue: string;
    infoPopUp?: boolean;
    className?: string;
    id?: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({
  color = "#348EF1",
  selectValue,
  infoPopUp = false,
  className = "",
 id = "lineChart"
}) => {
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

    const { data: balanceChartData, isLoading: isLoadingBalanceChart } = useGetBalanceChartQuery({ period: selectValue });
    const { data: walletsData, isLoading: isLoadingWallets } = useGetWalletsQuery();

    const isLoading = isLoadingBalanceChart || isLoadingWallets;

    const computedChartData = useMemo(() => {
        if (!balanceChartData) return [];

        const isTimeFrameData = selectValue === "MONTHLY" || selectValue === "WEEKLY";

        const labels = isTimeFrameData
            ? balanceChartData.lab ?? []
            : balanceChartData.mainData?.map(item => item.month) ?? []; // Safe fallback

        const values = isTimeFrameData
            ? balanceChartData.data ?? []
            : balanceChartData.mainData?.map(item => item.average) ?? [];

        const maxLength = Math.max(labels.length, values.length);

        return Array.from({ length: maxLength }, (_, index) => ({
            name: labels[index] ?? "Unknown",
            value: values[index] ?? 0,
        }));
    }, [balanceChartData, selectValue]);

    useEffect(() => {
        setChartData(computedChartData);
    }, [computedChartData]);

    const maxValue = Math.ceil(chartData.reduce((max, item) => Math.max(max, item.value), 0) * 1.2) || 300;

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className={`${styles.lineChart} ${className}`} id={id}>
            <p className={styles.chartTitle}>График изменения баланса</p>

            {infoPopUp && <Select value={selectValue} onChange={() => {}} />}

            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 20, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="50%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="100%" stopColor="rgba(21, 22, 23, 0)" stopOpacity={0} />
                        </linearGradient>
                        <filter id="topShadow" height="200%" width="100%" x="0" y="-50%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                            <feOffset dx="0" dy="-4" result="offsetBlur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.7" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <CartesianGrid vertical={false} horizontal strokeDasharray="5 5" stroke="rgba(0, 0, 0, 0.2)" strokeWidth={1} />
                    <XAxis dataKey="name" tick={{ fill: "#11263c", fontSize: 14 }} padding={{ left: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "black", fontSize: 14 }} tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "transparent", color: "white", padding: "8px", border: "none", borderRadius: 8 }}
                        formatter={(value) => [`$${value}`]}
                        labelStyle={{ display: "none" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorGradient)"
                        strokeLinecap="round"
                        filter="url(#topShadow)"
                        className={styles.mainLine}
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;