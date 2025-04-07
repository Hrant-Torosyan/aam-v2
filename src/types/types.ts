export interface DailyBalance {
    date: string;
    amount: number;
}
export interface PopUpState {
    isOpen: boolean;
    info: string | null;
    type: string;
    balance: number;
    percent: number;
}
export interface MonthlyBalance {
    date: string;
    amount: number;
}

export interface WalletsData {
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

export interface BalanceChartResponse {
    dailyBalancesChart: DailyBalance[];
    monthlyBalancesChart: MonthlyBalance[][] | null;
    profitability: number;
    masterAccount?: number;
    investmentAccount?: number;
    agentAccount?: number;
}

export interface OperationItem {
    id: string;
    amount: number;
    date: string;
    status: 'DONE' | 'IN_PROCESS' | 'FAILED';
    type: string;
    depositAddress?: string;
    depositCurrencyFrom?: string;
    withdrawalAddress?: string;
    withdrawalCurrencyFrom?: string;
    operationFrom?: string;
    operationTo?: string;
    projectTitle?: string;
    projectTerm?: string;
    projectPeriod?: string;
    fromUserId?: string;
    toUserId?: string | null;
}

export interface ProcessedBalanceChart {
    lab?: string[];
    data?: number[];
    mainData?: { month: string; average: number }[];
    profitability: number;
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

export interface BalanceChartRequest {
    period: string;
    accountType?: string;
    refresh?: number;
}


export interface UserImage {
    name: string;
    url: string;
}

export interface ProfileProduct {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    price?: number;
}

export interface ProfileProducts {
    items: ProfileProduct[];
    totalCount: number;
    content?: ProfileProduct[];
}

export interface ProfitData {
    profit: number;
    transactions: Array<any>;
    amount?: number;
}

export interface UserImage {
    name: string;
    url: string;
}

export interface UserInfo {
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    image?: UserImage | null;
    birthDay?: string | null;
    city?: string;
    country?: string | null;
    countryShort?: string | null;
    phone?: string;
    website?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    facebookUrl?: string;
    vkUrl?: string;
    userAccountType?: string;
    status?: boolean;
}

export interface ProfileProduct {
    id: string;
    name: string;
}


export interface UserAuth {
    token: string;
}

export interface Project {
    id: string;
    title: string;
    description?: string;
    category?: string;
    type?: string;
    tags: string[];
    image?: {
        url: string;
    };
    country?: string;
    minPrice?: number;
    active?: boolean;
    projectId?: string;
    productType?: string;
    companyLogo?: {
        url: string;
    };
    profit?: number
}

export interface Employee {
    id: string;
    name: string;
    position: string;
    image?: {
        url: string;
    };
}

export interface Investor {
    id: string;
    name: string;
    investmentAmount: number;
    date: string;
}

export interface HistoryItem {
    id: string;
    date: string;
    title: string;
    description: string;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface QueryData {
    [key: string]: string | number | boolean;
}

export type PeriodType = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface PaginatedResponse<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        offset: number;
    };
    size: number;
    sort: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}