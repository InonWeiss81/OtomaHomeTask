import { Injectable, OnInit } from "@angular/core";
import { ConverterResult } from "../models/converter-result";

@Injectable({ providedIn: 'root' })
export class HistoryService {

    private converterResults: ConverterResult[] = [];

    private resultsHistoryKey = 'resultsHistory';

    addResult(result: ConverterResult) {
        this.converterResults.push({...result});
        sessionStorage.setItem(this.resultsHistoryKey, JSON.stringify(this.converterResults));
    }

    getResults() {
        return this.converterResults;
    }

    clearResults() {
        this.converterResults = [];
        sessionStorage.setItem(this.resultsHistoryKey, '');
    }

    constructor() {
        let resultsHistoryFromStorage = sessionStorage.getItem(this.resultsHistoryKey)
        if (resultsHistoryFromStorage && resultsHistoryFromStorage.length > 0) {
            this.converterResults = JSON.parse(resultsHistoryFromStorage);
        }
    }

}