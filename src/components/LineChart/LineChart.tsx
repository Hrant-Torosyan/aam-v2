// LineChart.tsx (or .jsx)
import { useGetBalanceChartQuery } from 'src/store/analytics/analyticsAPI';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import styles from './LineChart.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';

interface LineChartProps {
    accountType?: string;
    colorsArr: string[];
}

const LineChart: React.FC<LineChartProps> = ({ accountType, colorsArr }) => {
    const period = useSelector((state: RootState) => state.analytics.selectValue);
    const { data: balanceChartData } = useGetBalanceChartQuery({ period, accountType });

    const mainData = balanceChartData?.mainData || [];
    const maxValue =
        mainData.reduce((max, val) => (val.average > max ? val.average : max), 0) * 1.2 || 20;

    const lineColor = colorsArr[0] || "rgb(48, 170, 235)"; // Default to blue if colorsArr is empty

    return (
        <div id="lineChart" className={styles.lineChart}>
            <p>График изменения баланса</p>
            <ResponsiveContainer height={200} width="100%">
                <AreaChart
                    data={mainData}
                    margin={{ top: 20, right: 20, bottom: 0, left: -10 }}
                >
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lineColor} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={`${lineColor}, 0`} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "rgba(255, 255, 255, 0.5)", fontSize: 14, fontWeight: 400 }}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fill: "rgba(255, 255, 255, 0.5)", fontSize: 14, fontWeight: 400 }}
                        domain={[0, maxValue]}
                        axisLine={false}
                        width={65}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "black",
                            color: "white",
                            padding: "5px",
                            border: "none",
                            borderRadius: 8,
                        }}
                        formatter={(value: ValueType) => [`$${value}`]}
                        labelStyle={{ display: "none" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="average"
                        stroke={lineColor}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChart;