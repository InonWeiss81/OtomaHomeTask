import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Converter } from 'src/app/models/converter';
import { getCurrencySymbol } from '@angular/common';
import { ConverterResult } from 'src/app/models/converter-result';
import { HistoryService } from 'src/app/services/history.service';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {

  //#region fields
  title = 'Currency Converter';

  currencyCodes: string[] = [];

  converterResult: ConverterResult;

  converterForm!: FormGroup;

  formSub: Subscription | undefined;
  currencySub: Subscription | undefined;
  convertSub: Subscription | undefined;
  //#endregion fields

  //#region initialize methods
  ngOnInit(): void {
    this.setCurrenciesList();
    this.buildForm();
    this.bindOnChanges();
  }

  buildForm() {
    this.converterForm = this.fb.group({
      amount: [''],
      from: [''],
      to: ['']
    });
  }

  bindOnChanges(): void {
    this.formSub = this.converterForm.valueChanges.subscribe(val => {
      let modelValue = <Converter>val;
      if (modelValue.amount && modelValue.from.length > 0 && modelValue.to.length > 0 && this.converterResult) {
        this.converterResult.inputAmount = modelValue.amount;
        this.converterResult.fromSymbol = getCurrencySymbol(modelValue.from, 'narrow');
        this.converterResult.toSymbol = getCurrencySymbol(modelValue.to, 'narrow');
        this.converterResult.converterData = modelValue;
        of(this.getConversionData(modelValue.amount, modelValue.from, modelValue.to)).subscribe(
          () => {
            this.historyService.addResult(this.converterResult);
          }
        );
      }
    });
  }

  setCurrenciesList() {
    this.currencySub = this.converterService.getCurrencies().subscribe(
      data => {
        this.currencyCodes = Object.keys(data);
        this.converterForm.controls['amount'].patchValue(1);
        this.converterForm.controls['from'].patchValue(this.currencyCodes.find(x => x === 'USD') ? 'USD' : this.currencyCodes[0]);
        this.converterForm.controls['to'].patchValue(this.currencyCodes.find(x => x === 'ILS') ? 'ILS' : this.currencyCodes[1]);
      }
    );
  }

  //#endregion initialize methods

  //#region other methods
  getConversionData(amount: number, from: string, to: string) {
    if (from == to) {
      this.converterResult.outputAmount = amount;
      return;
    }
    this.convertSub = this.converterService.convert(amount, from, to).subscribe(
      data => {
        let key = Object.keys(data.rates)[0];
        if (this.converterResult) {
          this.converterResult.outputAmount = <number><unknown>{ ...data.rates }[key];
        }
      }
    );
  }
  //#endregion other methods

  //#region end lifecycle hook
  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
    this.currencySub?.unsubscribe();
    this.convertSub?.unsubscribe();
  }

  //#endregion end lifecycle hook

  //#region cTor
  constructor(
    private converterService: ConverterService,
    private historyService: HistoryService,
    private fb: FormBuilder
  ) {
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
  //#endregion cTor
}
