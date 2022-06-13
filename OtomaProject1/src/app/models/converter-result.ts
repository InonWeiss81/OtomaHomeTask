import { Converter } from "./converter";

export interface ConverterResult {
    inputAmount: number | null;
    outputAmount: number | null;
    fromSymbol: string ;
    toSymbol: string;
    converterData: Converter;
}