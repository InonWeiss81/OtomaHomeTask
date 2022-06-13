import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ConvertResponse } from "../models/convert-response";

@Injectable({ providedIn: 'root' })
export class ConverterService {

    getCurrencies() {
        return this.http.get(environment.converterHostApi + environment.converterCurrenciesUrl);
    }

    convert(amount: number, from: string, to: string): Observable<ConvertResponse> {
        let httpParams: HttpParams = new HttpParams();
        httpParams = httpParams
            .set('amount', amount.toString())
            .set('from', from.toString())
            .set('to', to.toString());
        return this.http.get<ConvertResponse>(environment.converterHostApi +
            environment.converterAmountUrl, { params: httpParams });
    }


    constructor(private http: HttpClient) { }
}