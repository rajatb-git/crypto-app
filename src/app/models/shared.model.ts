export interface ResponseI {
    message?: string;
    data?: Object;
    status?: boolean;
}

export interface CryptoCompareResponseI {
    CoinInfo?: Object;
    RAW?: Object;
    DISPLAY?: Object;
}