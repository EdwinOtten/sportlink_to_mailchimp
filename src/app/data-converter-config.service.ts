/**
 * A DataConverterService that helps to convert a Sportlink export into a file that can be imported into Mailchimp.
 */

import { Injectable } from '@angular/core';
import * as parse from 'csv-parse/lib/sync';
import { isNullOrUndefined } from 'util';
import { IDataConverterService } from './interfaces/idata-converter-service';

@Injectable({
  providedIn: 'root'
})
export class DataConverterConfigService implements IDataConverterService {

  constructor() { }

  inputFileExtensions = ['.csv'];

  labels = {
    title: 'Sportlink to Mailchimp converter',
    subtitle: 'A tool to convert a Sportlink export into a file that can be imported into Mailchimp.',
    sourceStep: {
      title: 'Sportlink source',
      description: ''
    },
    previewStep: {
      title: 'Result preview',
      description: 'Check out the preview below before exporting the result.'
    },
    outputStep: {
      title: 'Mailchimp output',
      description: 'Import this into mailchimp'
    }
  };

  convertData(dataAsString: string): { columns: string[], rows: any} {
      const data = parse(dataAsString, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      if (isNullOrUndefined(data)) {
        throw Error('Failed to parse CSV data');
      }

      return {
        columns: Object.getOwnPropertyNames(data[0]),
        rows: data
      };
  }
}
