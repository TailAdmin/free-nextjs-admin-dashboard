export enum Currency {
    IQD = 'IQD',
    JOD = 'JOD',
    JPY = 'JPY',
    KRW = 'KRW',
    PYG = 'PYG',
    VND = 'VND',
    RP = 'RP',
}

export class Money {

    static currencyPrecision: Record<Currency, number> = {
        [Currency.IQD]: 3,
        [Currency.JOD]: 3,
        [Currency.JPY]: 0,
        [Currency.KRW]: 0,
        [Currency.PYG]: 0,
        [Currency.VND]: 0,
        [Currency.RP]: 0,
    };

    static getPrecision(currency: Currency): number {
        // Возвращаем точность из списка, либо 2, если валюты нет в объекте
        return this.currencyPrecision[currency] ?? 2;
}
}