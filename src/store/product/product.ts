import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Project,
    Employee,
    Investor,
    HistoryItem,
    BalanceChartResponse,
    QueryData,
    PeriodType,
    ProcessedBalanceChart,
    GetSimilarProductsArgs
} from 'src/types/types';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://aams.live/api/rest/';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            let token = '';
            try {
                const userAuth = localStorage.getItem('userAuth');
                if (userAuth) {
                    const parsedAuth = JSON.parse(userAuth);
                    token = parsedAuth.token || '';
                }
            } catch (error) {
                console.error("Error parsing auth token:", error);
            }

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProductInfo: builder.query<Project, string>({
            query: (id) => `projects/${id}`,
        }),

        getProductHistories: builder.query<HistoryItem[], string>({
            query: (id) => ({
                url: `projects/${id}/histories`,
                method: 'POST',
                body: {},
            }),
        }),

        getProductTeam: builder.query<Employee[], string>({
            query: (id) => ({
                url: `projects/${id}/employees`,
                method: 'POST',
                body: {},
            }),
        }),

        getProductInvestors: builder.query<Investor[], { id: string; queryData?: QueryData }>({
            query: ({ id, queryData }) => {
                const queryString = queryData ? `?${new URLSearchParams(queryData as Record<string, string>).toString()}` : '';
                return {
                    url: `projects/${id}/investors${queryString}`,
                    method: 'POST',
                };
            },
        }),

        getBalanceChart: builder.query<ProcessedBalanceChart, { prodId: string; period: PeriodType }>({
            query: ({ prodId, period }) => ({
                url: `projects/${prodId}/balance/chart`,
                method: 'POST',
                body: { period },
            }),
            transformResponse: (response: BalanceChartResponse) => {
                if (response?.monthlyBalancesChart === null) {
                    const lab = response?.dailyBalancesChart?.map((item) => {
                        if (response.period === 'WEEKLY') {
                            return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date(+item.date).getDay()];
                        }
                        return new Date(+item.date).toISOString().split('T')[0];
                    });

                    const dataChart = response?.dailyBalancesChart?.map((item) => item.amount);

                    return {
                        lab: lab as string[],
                        data: dataChart,
                        profitability: response.profitability || 0,
                        masterAccount: response.masterAccount || 0,
                        investmentAccount: response.investmentAccount || 0,
                        agentAccount: response.agentAccount || 0
                    };
                } else {
                    const sumsByMonth: Record<string, { sum: number; count: number }> = {};

                    response?.monthlyBalancesChart?.forEach((subArray) => {
                        subArray.forEach((item) => {
                            const currentDate = new Date(parseInt(item.date));
                            const yearMonth = currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1);

                            if (!sumsByMonth[yearMonth]) {
                                sumsByMonth[yearMonth] = {
                                    sum: 0,
                                    count: 0,
                                };
                            }

                            sumsByMonth[yearMonth].sum += item.amount;
                            sumsByMonth[yearMonth].count++;
                        });
                    });

                    const averagesByMonth = Object.entries(sumsByMonth).map(([month, { sum, count }]) => ({
                        month,
                        average: Math.floor(sum / count),
                    }));

                    return {
                        mainData: averagesByMonth,
                        profitability: response.profitability || 0,
                        masterAccount: response.masterAccount || 0,
                        investmentAccount: response.investmentAccount || 0,
                        agentAccount: response.agentAccount || 0
                    };
                }
            },
        }),

        getSimilarProducts: builder.query<Project[], GetSimilarProductsArgs>({
            query: ({ tags }) => ({
                url: 'projects/filter-by-tags',
                method: 'POST',
                body: { tags },
                params: { _t: Date.now() }
            }),
            transformResponse: (response: Project[], meta, arg) => {
                if (arg.excludeId) {
                    return response.filter(project => project.id !== arg.excludeId);
                }
                return response;
            },
        }),
    }),
});

export const {
    useGetProductInfoQuery,
    useGetProductHistoriesQuery,
    useGetProductTeamQuery,
    useGetProductInvestorsQuery,
    useGetBalanceChartQuery,
    useGetSimilarProductsQuery,
} = productApi;