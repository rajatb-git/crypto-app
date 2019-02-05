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

export interface CryptoCompareNewsResponseI {
    id: string;
    published_on: string;
    imageurl: string;
    title: string;
    url: string;
    source: string;
    body: string;
    tags: string;
}