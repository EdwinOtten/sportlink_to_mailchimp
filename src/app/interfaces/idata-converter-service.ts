export interface IDataConverterService {

  inputFileExtensions: string[];

  labels: {
    title: string,
    subtitle: string,
    sourceStep: {
      title: string,
      description: string
    },
    previewStep: {
      title: string,
      description: string
    },
    outputStep: {
      title: string,
      description: string
    }
  };

  convertData(dataAsString: string): { columns: string[], rows: any };
}
