import { Component, OnInit } from '@angular/core';
import { ConverterResult } from 'src/app/models/converter-result';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  title = 'Converter Results History';

  results: ConverterResult[] | undefined;

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.results = this.historyService.getResults();
  }

}
