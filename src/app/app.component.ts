import { Component } from '@angular/core'
import { DataConverterConfig } from 'angular-data-converter-component'
import { SportlinkToMailchimpConverter } from 'sportlink-to-mailchimp-converter'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  config: DataConverterConfig = {
    inputFileExtensions: ['.csv'],
    converterService: SportlinkToMailchimpConverter,
    labels: {
      sourceStep: {
        title: 'Sportlink source',
        description: '',
      },
      previewStep: {
        title: 'Result preview',
        description: 'Check out the preview below before exporting the result.',
      },
      outputStep: {
        title: 'Mailchimp output',
        description: 'Import this into mailchimp',
      },

      selectFile: 'Select CSV file',
    },
  }

}
