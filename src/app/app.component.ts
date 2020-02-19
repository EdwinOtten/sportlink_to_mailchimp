import { Component, ViewEncapsulation } from '@angular/core';
import { DataConverterConfigService } from './data-converter-config.service';
import { isNullOrUndefined } from 'util';
import { IDataConverterService } from './interfaces/idata-converter-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  fileLocation = '';
  sourceFileContents = '';
  destinationFileContents = '';
  progressMode = null;
  progressValue = 0;
  config: IDataConverterService;

  firstStepCompleted = false;
  browseError: string;

  columns: string[];
  dataSource: any[];

  constructor(private dataConverterService: DataConverterConfigService) {
    this.config = dataConverterService;
  }

  fileInputAccept(): string {
    return this.dataConverterService.inputFileExtensions.join(',');
  }

  openFile(event) {
    this.setProgress('buffer', 0);
    this.firstStepCompleted = false;

    for (const file of event.target.files) {
      this.readFile(file);
      break; // we only support reading one file at a time
    }
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.sourceFileContents = reader.result as string;
      this.handleFileData(this.sourceFileContents);
    };
    reader.readAsText(file);
  }

  handleFileData(dataAsString: string) {
    try {
      this.setProgress('determinate', 11);
      const data = this.dataConverterService.convertData(dataAsString);
      this.setProgress('determinate', 22);

      if (!isNullOrUndefined(data)) {
        this.browseError = null;
        this.showPreview(data.columns, data.rows);
      }
    } catch (e) {
      this.browseError = e;
      this.setProgress('determinate', 0);
    }
  }

  showPreview(columns: string[], data: any[]) {
    this.dataSource = data;
    this.columns = columns;
    this.firstStepCompleted = true;
    this.setProgress('determinate', 33);
  }

  setProgress(mode: 'determinate' | 'indeterminate' | 'buffer' | 'query', value?: number) {
    this.progressMode = mode;
    if (value) {
      this.progressValue = value;
    }
  }
}
