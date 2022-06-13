import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Converter } from 'src/app/models/converter';
import { getCurrencySymbol } from '@angular/common';
import { ConverterResult } from 'src/app/models/converter-result';
import { HistoryService } from 'src/app/services/history.service';
import { debounceTime, of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  showSpinner: boolean = false;
  debounceTime = 1000;

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

  private resetConverterResult() {
    return  {
      fromSymbol: '',
      inputAmount: null,
      outputAmount: null,
      toSymbol: '',
      converterData: {
        amount: null,
        from: '',
        to: ''
      }
    };
  }

  buildForm() {
    this.converterForm = this.fb.group({
      amount: [''],
      from: [''],
      to: ['']
    });
  }

  bindOnChanges(): void {
    this.formSub = this.converterForm.valueChanges.pipe(
      tap(_ => this.setSpinner(true)), debounceTime(this.debounceTime))
      .subscribe(val => {
      let modelValue = <Converter>val;
      this.executeRequest(modelValue);
    });
  }

  setCurrenciesList() {
    this.currencySub = this.converterService.getCurrencies().subscribe(
      data => {
        this.currencyCodes = Object.keys(data);
        this.converterForm.controls['amount'].patchValue(null);
        this.converterForm.controls['from'].patchValue(this.currencyCodes.find(x => x === 'USD') ? 'USD' : this.currencyCodes[0]);
        this.converterForm.controls['to'].patchValue(this.currencyCodes.find(x => x === 'ILS') ? 'ILS' : this.currencyCodes[1]);
      }
    );
  }

  //#endregion initialize methods

  //#region other methods
  executeRequest(modelValue: Converter) {
    if (modelValue.amount && modelValue.from.length > 0 && modelValue.to.length > 0 && this.converterResult) {
      this.converterResult.inputAmount = modelValue.amount;
      this.converterResult.fromSymbol = getCurrencySymbol(modelValue.from, 'narrow');
      this.converterResult.toSymbol = getCurrencySymbol(modelValue.to, 'narrow');
      this.converterResult.converterData = modelValue;
      of(this.getConversionData(modelValue.amount, modelValue.from, modelValue.to)).subscribe(
        () => {
          this.showSpinner = false;
        }
      );
    }
    else {
      this.converterResult = this.resetConverterResult();
      this.showSpinner = false;
    }
  }

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
          this.historyService.addResult(this.converterResult);
        }
      }
    );
  }

  setSpinner(show: boolean) {
    this.showSpinner = this.converterForm.dirty && show;
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
    
    this.converterResult = this.resetConverterResult();
  }


  //#endregion cTor
}
