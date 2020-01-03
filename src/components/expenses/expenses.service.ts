import { ImageParsingResult } from './receipt.types'

export class ExpensesService {
  static parseReceiptImage = async (image: Blob): Promise<string> => {
    return await 'the_token'
  }

  static getReceiptParsingResult = async (token: string): Promise<ImageParsingResult> => {
    return await {
      establishment: 'Lidl sp. z o.o. sp. k.',
      date: '2019-05-20 00:00:00',
      total: parseFloat('29.020'),
      lineItems: [
        {
          description: 'BIO BORÓWKA AMERYK.S F *',
          total: parseFloat('5.990'),
          supplementaryLineItems: {
            above: [],
            below: [
              {
                description: 'FILET Z P.KURCZAKA F',
                total: parseFloat('0.000'),
              },
            ],
          },
        },
        {
          description: '0,595 *',
          total: parseFloat('10.050'),
          supplementaryLineItems: {
            above: [
              {
                description: 'FILET Z P.KURCZAKA F',
                total: parseFloat('0.000'),
              },
            ],
            below: [],
          },
        },
        {
          description: 'KALAFIOR ŚWIEŻY 500G',
          total: parseFloat('6.990'),
        },
        {
          description: 'SZPARAGI ZIEL.500G 1 * 5',
          total: parseFloat('5.990'),
        },
      ],
    }
  }
}
