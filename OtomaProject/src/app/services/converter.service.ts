import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ConverterService {

    getCurrencies() {
        return this.http.get(environment.converterHostApi + environment.converterCurrenciesUrl);
    }

    convert(amount: number, from: string, to: string) {
        let httpParams: HttpParams = new HttpParams();
        httpParams = httpParams
            .set('amount', amount.toString())
            .set('from', from.toString())
            .set('to', to.toString());
        return this.http.get(environment.converterHostApi +
            environment.converterAmountUrl, { params: httpParams });
    }


    constructor(private http: HttpClient) { }
}