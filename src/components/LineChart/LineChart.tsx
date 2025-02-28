import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import Select from "src/components/Select/Select";
import { useDispatch } from "react-redux";
import { setSelectValue } from "src/store/analytics/analyticsSlice";
import styles from './LineChart.module.scss';

interface LineChartProps {
    balanceChartData: any;
    color?: string;
    bg?: string;
    selectValue: string;
    infoPopUp?: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({
      balanceChartData,
      color = "rgb(48, 170, 235)",
      bg = "rgba(48, 170, 235, 0.2)",
      selectValue,
      infoPopUp
  }) => {
    const dispatch = useDispatch();
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        let labelsArr: string[] = [];
        let dataArr: number[] = [];

        if (selectValue === "MONTHLY") {
            labelsArr = balanceChartData?.lab?.map((item: Date) => `${item.getDate()}`);
            dataArr = balanceChartData?.data || [];
        } else if (selectValue === "WEEKLY") {
            labelsArr = balanceChartData?.lab || [];
            dataArr = balanceChartData?.data || [];
        } else {
            labelsArr = balanceChartData?.mainData?.map((item: any) => item.month) || [];
            dataArr = balanceChartData?.mainData?.map((item: any) => item.average) || [];
        }

        // Set the chart data
        setChartData(labelsArr.map((label, index) => ({
            name: label,
            value: dataArr[index] || 0
        })));
    }, [balanceChartData, selectValue]);

    const handleSelectChange = (value: string) => {
        dispatch(setSelectValue(value));
    };

    return (
        <div id="lineChart" className={styles.lineChart}>
            <p>График изменения баланса</p>

            {infoPopUp === "popUp" && (
                <Select value={selectValue} onChange={handleSelectChange} />
            )}

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            color: "rgb(52, 142, 241)",
                            padding: "5px",
                            border: "none",
                            borderRadius: 8,
                        }}
                        formatter={(value: number) => `${value}$`}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        fill={bg}
                        strokeWidth={2}
                        fillOpacity={1}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;