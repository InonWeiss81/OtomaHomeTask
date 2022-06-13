import { Converter } from "./converter";

export interface ConverterResult {
    inputAmount: number;
    outputAmount: number | null;
    fromSymbol: string ;
    toSymbol: string;
    converterData: Converter;
}