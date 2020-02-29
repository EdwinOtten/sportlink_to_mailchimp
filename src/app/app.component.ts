import { Component, ViewEncapsulation, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { DataConverterConfigService } from './data-converter-config.service';
import { isNullOrUndefined } from 'util';
import { IDataConverterService } from './interfaces/idata-converter-service';
import { MatVerticalStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  fileLocation = '';
  sourceFileContents = '';
  destinationFileContents = '';
  progressMode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'determinate';
  progressValue = 4;
  config: IDataConverterService;

  sourceError: string;
  currentFile: File;

  columns: string[];
  dataSource: any[];

  @ViewChild('stepper', {static: false}) private stepper: MatVerticalStepper;

  constructor(private ngZone: NgZone,
              private dataConverterService: DataConverterConfigService) {
    this.config = dataConverterService;
  }

  ngAfterViewInit(): void {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      this.progressValue = 4 + (48 * event.selectedIndex);
    });
  }

  fileInputAccept(): string {
    return this.dataConverterService.inputFileExtensions.join(',');
  }

  openFile(event) {
    this.currentFile = null;
    this.progressMode = 'buffer';
    this.dataSource = null;
    this.columns = null;

    for (const file of event.target.files) {
      this.processFile(file);
      break; // we only support reading one file at a time
    }
  }

  async processFile(file: File) {
    try {
      this.currentFile = file;
      const data = await this.dataConverterService.convertFileToPreview(file);

      if (!isNullOrUndefined(data)) {
        this.sourceError = null;
        this.progressMode = 'determinate';
        this.showPreview(data.columns, data.rows);
      }
    } catch (e) {
      this.currentFile = null;
      this.progressMode = 'determinate';
      this.sourceError = e;
    }
  }

  showPreview(columns: string[], data: any[]) {
    this.dataSource = data;
    this.columns = columns;

    this.ngZone.run(() => {
      this.stepper.selected.completed = true;
      this.stepper.selectedIndex = 1;
    });
  }

  async downloadFile() {
    const output = await this.dataConverterService.convertFileToOutput(this.currentFile);
    this.openSaveFileDialog(output.data, output.filename, output.mimetype);
  }

  openSaveFileDialog(data: any, filename: string, mimetype: string) {

    if (!data) { return; }

    const blob = data.constructor !== Blob
      ? new Blob([data], {type: mimetype || 'application/octet-stream'})
      : data ;

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
      return;
    }

    const lnk = document.createElement('a');
    const url = window.URL;

    if (mimetype) {
      lnk.type = mimetype;
    }

    lnk.download = filename || 'untitled';
    lnk.href = url.createObjectURL(blob);
    lnk.dispatchEvent(new MouseEvent('click'));
    setTimeout(url.revokeObjectURL.bind(url, lnk.href));
  }
}
