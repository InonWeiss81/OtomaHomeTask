import { Component, Input, OnInit } from '@angular/core';
import { ConverterResult } from 'src/app/models/converter-result';

@Component({
  selector: 'app-converter-result',
  templateUrl: './converter-result.component.html',
  styleUrls: ['./converter-result.component.scss']
})
export class ConverterResultComponent implements OnInit {

  @Input('converterResult') converterResult: ConverterResult | undefined;

  constructor() { }

  ngOnInit(): void {
    if (!this.converterResult) {
      this.converterResult = {
        fromSymbol: '',
        inputAmount: 1,
        outputAmount: null,
        toSymbol: '',
        converterData: {
          amount: 1,
          from: '',
          to: ''
        }
      }
    }
  }
}
