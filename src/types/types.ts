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
    period?: PeriodType;
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
    name?: string;
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

export interface UserAuth {
    token: string;
    refreshToken?: string;
    expiresIn?: number;
}

export interface Project {
    id: string;
    title: string;
    companyDescription?: string;
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
    profit?: number;
    mediaImages?: Array<{
        url?: {
            url?: string;
        };
        name?: string;
    }>;
    financialIndicatorContent?: string;
    ceoPosition?: string;
    ceoLastname?: string;
    ceoFirstname?: string;
    ceoImage?: {
        url?: string;
    };
    employeesContent?: string;
    fundDetails?: Record<string, string>;
    presentations?: Array<{
        url?: {
            url?: string;
            name?: string;
        };
        name?: string;
        [key: string]: any;
    }>;
}

export interface Employee {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    position: string;
    image?: {
        url: string;
    };
}

export interface Investor {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    investmentAmount?: number;
    amount?: number;
    date?: string;
}

export interface HistoryItem {
    id: string;
    date?: string;
    createdAt?: string;
    title?: string;
    type?: string;
    description?: string;
    amount?: number;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface QueryData {
    [key: string]: string | number | boolean;
}

export type PeriodType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface PaginatedResponse<T> {
    content: T[];
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: {
        pageNumber: number;
        pageSize: number;
        sort?: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        offset?: number;
    };
    size?: number;
    sort?: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}

export interface GetSimilarProductsArgs {
    tags: string[];
    excludeId?: string;
}

export interface CategoriesResponse {
    success: boolean;
    data: { id: string; name: string }[];
}

export interface ProjectListParams {
    category?: string | null;
    type?: string | null;
    title?: string | null;
    tags?: string[] | null;
}

export interface ProjectWithInvestmentData extends Project {
    conditionDocuments?: Array<{
        name?: string;
        url?: {
            url?: string;
            name?: string;
        };
    }>;
    minPrice: number;
    maxPrice: number;
    purchaseCommission: number;
    profitCommission: number;
    withdrawalCommission: number;
    managementCommission: number;
    investmentAmount: number;
    paymentPeriods?: string[];
    term?: number;
    projectId: string;
}

export interface InvestRequestData {
    amount: number;
    purchaseCommission: number;
    profitCommission: number;
    withdrawalCommission: number;
    managementCommission: number;
    period?: string | null;
    term?: number;
}
