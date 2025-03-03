import React, { useEffect, useRef, useState } from "react";

import { Chart as ChartJS } from "chart.js/auto";

import { useGetAnalyticListQuery } from "src/store/analytics/analyticsAPI";

import styles from './DoughnutChart.module.scss';

interface AnalyticItem {
    title: string;
    percentage: number;
}

interface DoughnutChartProps {
    count: number | null;
    colorsArr: string[];
    refresh: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ count, colorsArr, refresh }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<ChartJS | null>(null);

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, size: 60 });

    // const mockData = {
    //     content: [
    //         { title: "Active 1", percentage: 25 },
    //         { title: "Active 2", percentage: 30 },
    //         { title: "Active 3", percentage: 45 },
    //     ],
    // };

    const { data: analyticListData, isLoading, isError } = useGetAnalyticListQuery({
        queryData: { pageSize: count?.toString() ?? '10' },
    });

    // const analyticListData = mockData;

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let size = 60;
            if ((width > 576 && width <= 991) || width <= 400) {
                size = 40;
            }
            setWindowSize({ width, size });
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                const data = analyticListData?.content ?? [];

                chartInstance.current = new ChartJS(ctx, {
                    type: "doughnut",
                    data: {
                        labels: data.map((item: AnalyticItem) => item.title),
                        datasets: [
                            {
                                data: data.map((item: AnalyticItem) => item.percentage),
                                backgroundColor: data.map((item: AnalyticItem, key: number) => colorsArr[key] || "#ddd"),
                            },
                        ],
                    },
                    options: {
                        cutout: windowSize.size,
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => ` (${context.dataset.data[context.dataIndex]}%)`,
                                },
                            },
                            legend: { display: false },
                        },
                    },
                });
            }
        }

        return () => {
            chartInstance.current?.destroy();
        };
    }, [windowSize, colorsArr, refresh, analyticListData]);

    const isDataAvailable = analyticListData?.content?.length > 0;

    return (
        <div className={styles.chartBlock}>
            <p>{isDataAvailable ? analyticListData.content.length : 0} активов</p>
            <canvas ref={chartRef} />
        </div>
    );
};

export default DoughnutChart;