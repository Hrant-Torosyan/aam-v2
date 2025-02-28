import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = "http://145.223.99.13:8080/api/rest/";

const ENDPOINTS = {
    WALLETS: "wallets",
    BALANCE_CHART: "wallets/balance/chart",
    OPERATIONS_LIST: "transaction/operations/list",
    OPERATIONS_ITEM: "transaction/operations",
    TRANSFER: "wallets/inner/transfer",
    REPLENISH: "deposit/payments/create",
    REPLENISH_GET: "deposit/payments/currency/info",
    SEND_USER: "wallets/outer/transfer",
    SEND_WALLET: "withdrawal/payments/request",
    ANALYTIC: "portfolios/analytic/list",
};

interface DailyBalance {
    date: string;
    amount: number;
}

interface MonthlyBalance {
    date: string;
    amount: number;
}

interface WalletsData {
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

interface BalanceChartResponse {
    dailyBalancesChart: DailyBalance[];
    monthlyBalancesChart: MonthlyBalance[][] | null;
    profitability: number;
    masterAccount?: number;
    investmentAccount?: number;
    agentAccount?: number;
}

interface ProcessedBalanceChart {
    lab?: string[];
    data?: number[];
    mainData?: { month: string; average: number }[];
    profitability: number;
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

interface BalanceChartRequest {
    period: string;
    accountType?: string;
    refresh?: number;
}

const processBalanceChartResponse = (response: BalanceChartResponse, period: string): ProcessedBalanceChart => {
    if (!response) {
        return {
            lab: [],
            data: [],
            mainData: [],
            profitability: 0,
            masterAccount: 0,
            investmentAccount: 0,
            agentAccount: 0,
        };
    }

    if (!response.monthlyBalancesChart) {
        const lab = response.dailyBalancesChart.map(item =>
            period === "WEEKLY"
                ? ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][new Date(+item.date).getDay()]
                : new Date(+item.date).toLocaleDateString()
        );

        const data = response.dailyBalancesChart.map(item => item.amount);
        return {
            lab,
            data,
            profitability: response.profitability,
            masterAccount: response.masterAccount ?? 0,
            investmentAccount: response.investmentAccount ?? 0,
            agentAccount: response.agentAccount ?? 0,
        };
    }

    const sumsByMonth: Record<string, { sum: number; count: number }> = {};

    response.monthlyBalancesChart.forEach(subArray => {
        subArray.forEach(item => {
            const currentDate = new Date(parseInt(item.date));
            const yearMonth = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`;

            if (!sumsByMonth[yearMonth]) {
                sumsByMonth[yearMonth] = { sum: 0, count: 0 };
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
        profitability: response.profitability,
        masterAccount: response.masterAccount ?? 0,
        investmentAccount: response.investmentAccount ?? 0,
        agentAccount: response.agentAccount ?? 0,
    };
};

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const userAuth = localStorage.getItem('userAuth');
            const token = userAuth ? JSON.parse(userAuth).token : null;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getBalanceChart: builder.query<ProcessedBalanceChart, BalanceChartRequest>({
            query: ({ period, accountType, refresh }) => ({
                url: ENDPOINTS.BALANCE_CHART,
                method: 'POST',
                body: { period, accountType, refresh },
            }),
            transformResponse: (response: BalanceChartResponse, meta, args) => {
                return processBalanceChartResponse(response, args.period);
            },
        }),

        getWallets: builder.query<WalletsData, void>({
            query: () => ({
                url: ENDPOINTS.WALLETS,
                method: 'GET',
            }),
        }),

        getOperationsList: builder.query<any, { accountType?: string; pageNumber?: number }>({
            query: ({ accountType, pageNumber }) => {
                const queryParams = new URLSearchParams();
                if (pageNumber) queryParams.append('pageSize', String(pageNumber));

                const validAccountTypes = ["MASTER", "INVESTMENT", "AGENT"];
                const body: Record<string, any> = {};

                if (accountType && validAccountTypes.includes(accountType)) {
                    body.accountType = accountType;
                }

                return {
                    url: `${ENDPOINTS.OPERATIONS_LIST}?${queryParams.toString()}`,
                    method: 'POST',
                    body: body,
                };
            },
        }),

        getOperationsListItem: builder.query<any, { id: string }>({
            query: ({ id }) => ({
                url: `${ENDPOINTS.OPERATIONS_ITEM}/${id}`,
                method: 'GET',
            }),
        }),

        setTransfer: builder.mutation<any, { bodyData: object }>({
            query: ({ bodyData }) => ({
                url: ENDPOINTS.TRANSFER,
                method: 'POST',
                body: bodyData,
            }),
        }),

        setReplenish: builder.mutation<any, { bodyData: object }>({
            query: ({ bodyData }) => ({
                url: ENDPOINTS.REPLENISH,
                method: 'POST',
                body: bodyData,
            }),
        }),

        getReplenishMinMax: builder.query<any, { currencyFrom: string; currencyTo: string }>({
            query: ({ currencyFrom, currencyTo }) => ({
                url: `${ENDPOINTS.REPLENISH_GET}?currencyFrom=${currencyFrom}&currencyTo=${currencyTo}`,
                method: 'GET',
            }),
        }),

        setSendUser: builder.mutation<any, { bodyData: object }>({
            query: ({ bodyData }) => ({
                url: ENDPOINTS.SEND_USER,
                method: 'POST',
                body: bodyData,
            }),
        }),

        setSendWallet: builder.mutation<any, { bodyData: object }>({
            query: ({ bodyData }) => ({
                url: ENDPOINTS.SEND_WALLET,
                method: 'POST',
                body: bodyData,
            }),
        }),

        getAnalyticList: builder.query<any, { queryData: Record<string, string> }>({
            query: ({ queryData }) => {
                const queryString = new URLSearchParams(queryData).toString();
                return {
                    url: `${ENDPOINTS.ANALYTIC}?${queryString}`,
                    method: 'POST',
                };
            },
        }),
    }),
});

export const {
    useGetBalanceChartQuery,
    useGetWalletsQuery,
    useGetOperationsListQuery,
    useGetOperationsListItemQuery,
    useSetTransferMutation,
    useSetReplenishMutation,
    useGetReplenishMinMaxQuery,
    useSetSendUserMutation,
    useSetSendWalletMutation,
    useGetAnalyticListQuery,
} = analyticsApi;