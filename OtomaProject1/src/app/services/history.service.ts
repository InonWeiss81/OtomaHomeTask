import { Injectable } from "@angular/core";
import { ConverterResult } from "../models/converter-result";

@Injectable({ providedIn: 'root' })
export class HistoryService {

    private converterResults: ConverterResult[] = [];

    addResult(result: ConverterResult) {
        this.converterResults.push(result);
    }

    getResults() {
        return this.converterResults;
    }

    clearResults() {
        this.converterResults = [];
    }

}