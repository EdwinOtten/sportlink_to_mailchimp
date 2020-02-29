/**
 * A DataConverterService that helps to convert a Sportlink export into a file that can be imported into Mailchimp.
 */

import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { IDataConverterService, PreviewResult, OutputResult } from './interfaces/idata-converter-service';

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

  async convertFileToPreview(file: File): Promise<PreviewResult> {
    const parseResult = await this.parseData(file);
    return {
      columns: ['Lidnummer', 'Achternaam', 'Email'],
      rows: parseResult.data.map(row => ({
        Lidnummer: row.Roepnaam,
        Achternaam: (((row['Tussenvoegsel(s)'] ? row['Tussenvoegsel(s)'] : '') + ' ' + row.Achternaam) as string).trim(),
        Email: row['E-mail'],
      }))
    };
  }

  async convertFileToOutput(file: File): Promise<OutputResult> {
    const data = await this.convertFileToPreview(file);
    const csvData = Papa.unparse(data.rows, {
      quotes: true
    });

    const originalFilename = file.name.substring(0, file.name.lastIndexOf('.'));
    return {
      mimetype: 'text/csv;charset=utf-8;',
      filename: originalFilename + '_converted_to_mailchimp.csv',
      data: csvData
    };
  }

  private async parseData(file: File): Promise<Papa.ParseResult> {
      return new Promise((complete, error) => {
        Papa.parse(file, {
          skipEmptyLines: true,
          dynamicTyping: true,
          quoteChar: '|',
          delimiter: ';',
          header: true,
          transformHeader(header) {
            return header.trim().replace('"', '').replace('"', '');
          },
          transform(value) {
            return value.trim().replace('"', '').replace('"', '');
          },
          error,
          complete
        });
      });
  }
}
