import { ConverterService } from './services/converter.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'OtomaProject';

  currencies_KeyValue: { code: string, value: string }[] = [];

  ngOnInit() {
    this.setCurrenciesList();
  }

  setCurrenciesList() {
    this.converterService.getCurrencies().subscribe(
      data => {
        this.currencies_KeyValue = Object.keys(data).map((key) => { return {code: key, value: data[key]}});
        console.log(this.currencies_KeyValue);
      }
    );
  }

  setConversionResult() {
    let amount: number = 1;
    let from: string = 'USD';
    let to: string = 'ILS';
    this.getConversionData(amount, from ,to);
    
  }

  getConversionData(amount: number, from: string, to: string) {
    this.converterService.convert(amount, from, to).subscribe(
      data => {
        console.log(data);
      }
    );
  }

  constructor(private converterService: ConverterService) {}
}
