export type CurrencyKey = "USDT" | "BTC" | "ETH";

export interface AccountDetails {
    name: string;
    currency?: string;
    min_amount?: number;
    max_amount?: number;
}

export const Infoes: Record<CurrencyKey, Array<AccountDetails>> = {
    USDT: [
        {
            name: "Matic Network",
            currency: "usdcmatic",
            min_amount: 8,
            max_amount: 2886,
        },
        {
            name: "Arbitrum Network",
            currency: "usddbsc",
            min_amount: 9,
            max_amount: 579,
        },
        {
            name: "TRON Network",
            currency: "usdttrc20",
            min_amount: 10,
            max_amount: 76798,
        },
        {
            name: "Ethereum Network",
            currency: "usdterc20",
            min_amount: 11,
            max_amount: 76798,
        },
        {
            name: "Binance Smart Chain Network",
            currency: "usdtbsc",
            min_amount: 9,
            max_amount: 23089,
        },
        {
            name: "Solana Network",
            currency: "usdtsol",
            min_amount: 69,
            max_amount: 16072,
        },
        {
            name: "Algorand Network",
            currency: "usdtalgo",
            min_amount: 8,
            max_amount: 2889,
        },
    ],
    BTC: [
        {
            name: "Bitcoin",
            currency: "btc",
            min_amount: 0.0001783,
            max_amount: 1.26359284,
        },
    ],
    ETH: [
        {
            name: "ETH",
            currency: "eth",
            min_amount: 1,
            max_amount: 26,
        },
        {
            name: "ETHBSC",
            currency: "ethbsc",
            min_amount: 0.0031139,
            max_amount: 5,
        },
        {
            name: "ETHArb",
            currency: "etharb",
            min_amount: 0.0029608,
            max_amount: 0.85378951,
        },
    ],
};