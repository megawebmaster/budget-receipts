import { AppAction } from '../../app.actions'
import { ApiReceipt } from './receipt.types'
import { receiptsLoadingError, updateReceipts } from './expenses.actions'
import { AppMessageType } from '../message-list'

type ParsingResultItem = {
  descClean: string
  lineTotal: number
  supplementaryLineItems?: {
    above: ParsingResultItem[]
    below: ParsingResultItem[]
  }
}

type ParsingResult = {
  establishment: string
  date: string
  total: number
  lineItems: ParsingResultItem[]
}

export class ExpensesService {
  static loadFromCache = async (request: Request): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()
      const content = await response.json() as { receipts: ApiReceipt[] }

      return updateReceipts({
        receipts: content.receipts,
        source: 'cache',
      })
    }

    return await updateReceipts({
      receipts: [
        {
          id: 1,
          date: 20,
          shop: 'Lidl',
          items: [
            { id: 1, category: 'c2', price: 200, description: 'Test 1' },
            { id: 2, category: 'c1', price: 100, description: 'Test 2' },
          ],
        },
        {
          id: 2,
          date: 21,
          shop: 'Biedronka',
          items: [
            { id: 3, category: 'c1', price: 100.23, description: 'Test 3' },
          ],
        },
      ],
      source: 'cache',
    })
  }

  static fetchFromNetwork = async (request: Request): Promise<AppAction> => {
    try {
      const response = await fetch(request)
      const cache = await caches.open('SimplyBudget')
      cache.put(request, response.clone())

      const content = await response.json() as { receipts: ApiReceipt[] }

      return await updateReceipts({
        receipts: content.receipts,
        source: 'network',
      })
    } catch (err) {
      // return new Promise<AppAction>(resolve => {
      //   setTimeout(() => resolve(updateReceipts({
      //     receipts: [
      //       {
      //         id: 3,
      //         date: 20,
      //         shop: 'Lidl',
      //         items: [
      //           { id: 1, category: 'c2', price: 200, description: 'Test 1' },
      //           { id: 2, category: 'c1', price: 100, description: 'Test 2' },
      //         ],
      //       }],
      //     source: 'network',
      //   })), 1000)
      // })

      return await receiptsLoadingError({
        text: 'Network connection failed',
        sticky: false,
        type: AppMessageType.ERROR,
      })
    }
  }

  static parseReceiptImage = async (image: string): Promise<string> => {
    return await 'the_token'
  }

  static getReceiptParsingResult = async (token: string): Promise<ParsingResult> => {
    return await {
      establishment: 'Lidl sp. z o.o. sp. k.',
      validatedEstablishment: false,
      date: '2019-05-20 00:00:00',
      total: parseFloat('29.020'),
      url: '',
      phoneNumber: '',
      paymentMethod: '',
      address: '',
      cash: '0.000',
      change: '0.000',
      validatedTotal: false,
      subTotal: '29.020',
      validatedSubTotal: true,
      tax: '0.000',
      taxes: [],
      discount: '0.000',
      rounding: '0.000',
      discounts: [],
      lineItems: [
        {
          qty: 1,
          desc: 'BIO BORÓWKA AMERYK.S F 1 * 5,99',
          unit: '',
          price: '5.990',
          discount: '0.000',
          descClean: 'BIO BORÓWKA AMERYK.S F *',
          lineTotal: parseFloat('5.990'),
          productCode: '',
          customFields: [],
          supplementaryLineItems: {
            above: [],
            below: [
              {
                qty: 0,
                desc: 'FILET Z P.KURCZAKA F',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: 'FILET Z P.KURCZAKA F',
                lineTotal: parseFloat('0.000'),
                confidence: '0.500',
                productCode: '',
                customFields: [],
              },
            ],
          },
        },
        {
          qty: 0,
          desc: '0,595 * 16,89',
          unit: '',
          price: '16.890',
          discount: '0.000',
          descClean: '0,595 *',
          lineTotal: parseFloat('10.050'),
          productCode: '',
          customFields: [],
          supplementaryLineItems: {
            above: [
              {
                qty: 0,
                desc: 'FILET Z P.KURCZAKA F',
                unit: '',
                price: parseFloat('0.000'),
                discount: '0.000',
                descClean: 'FILET Z P.KURCZAKA F',
                lineTotal: parseFloat('0.000'),
                confidence: '0.500',
                productCode: '',
                customFields: [],
              },
            ],
            below: [],
          },
        },
        {
          qty: 99,
          desc: '99 KALAFIOR ŚWIEŻY 500G',
          unit: '500G',
          price: '0.000',
          discount: '0.000',
          descClean: 'KALAFIOR ŚWIEŻY 500G',
          lineTotal: parseFloat('6.990'),
          productCode: '',
          customFields: [],
        } as ParsingResultItem,
        {
          qty: 6,
          desc: 'SZPARAGI ZIEL.500G 6 1 * 5',
          unit: '500G',
          price: '0.000',
          discount: '0.000',
          descClean: 'SZPARAGI ZIEL.500G 1 * 5',
          lineTotal: parseFloat('5.990'),
          productCode: '',
          customFields: [],
        },
      ],
      summaryItems: [
        {
          qty: 0,
          desc: 'Sprzed,opod.PTU C',
          unit: '',
          price: '0.000',
          discount: '0.000',
          descClean: 'Sprzed,opod.PTU C',
          lineTotal: '29.020',
          productCode: '',
          customFields: [],
        },
        {
          qty: 0,
          desc: 'Kwota C 05,00%',
          unit: '',
          price: '0.000',
          discount: '0.000',
          descClean: 'Kwota C 05,00%',
          lineTotal: '1.380',
          productCode: '',
          customFields: [],
        },
        {
          qty: 0,
          desc: 'Podatek PTU',
          unit: '',
          price: '0.000',
          discount: '0.000',
          descClean: 'Podatek PTU',
          lineTotal: '1.380',
          productCode: '',
          customFields: [],
          supplementaryLineItems: {
            above: [],
            below: [
              {
                qty: 2,
                desc: '29,02 2 Podatek SUMA PLN nr : 851788',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: '29,02 Podatek SUMA PLN nr',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '851788',
                customFields: [],
              },
            ],
          },
        },
        {
          qty: 1,
          desc: '000705 # 1 13 1776 nr : 851788',
          unit: '',
          price: '0.000',
          discount: '0.000',
          descClean: '# 13 1776 nr : 851788',
          lineTotal: '17.270',
          productCode: '000705',
          customFields: [],
          supplementaryLineItems: {
            above: [
              {
                qty: 2,
                desc: '29,02 2 Podatek SUMA PLN nr : 851788',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: '29,02 Podatek SUMA PLN nr',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '851788',
                customFields: [],
              },
            ],
            below: [
              {
                qty: 0,
                desc: '75YQM - Ho 17V - GXVFZ - W7CFX - KNNAS',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: '75YQM - Ho 17V - GXVFZ - W7CFX - KNNAS',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '',
                customFields: [],
              },
              {
                qty: 0,
                desc: 'PBGI 14145220',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: 'PBGI',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '14145220',
                customFields: [],
              },
            ],
          },
        },
        {
          qty: 0,
          desc: 'Płatność karta płatnicz',
          unit: '',
          price: '0.000',
          discount: '0.000',
          descClean: 'Płatność karta płatnicz',
          lineTotal: '29.020',
          productCode: '',
          customFields: [],
          supplementaryLineItems: {
            above: [
              {
                qty: 0,
                desc: '75YQM - Ho 17V - GXVFZ - W7CFX - KNNAS',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: '75YQM - Ho 17V - GXVFZ - W7CFX - KNNAS',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '',
                customFields: [],
              },
              {
                qty: 0,
                desc: 'PBGI 14145220',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: 'PBGI',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '14145220',
                customFields: [],
              },
            ],
            below: [],
          },
        },
        {
          qty: 0,
          desc: 'RAZEM PLN',
          unit: '',
          price: '0.000',
          discount: '0.000',
          descClean: 'RAZEM PLN',
          lineTotal: '-29.020',
          productCode: '',
          customFields: [],
          supplementaryLineItems: {
            above: [],
            below: [
              {
                qty: 0,
                desc: 'Dziękujemy za zakupy w LIDL ! - -',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: 'Dziękujemy za zakupy w LIDL ! - -',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '',
                customFields: [],
              },
              {
                qty: 0,
                desc: 'Pobierz : www.lidlplus.pl',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: 'Pobierz : www.lidlplus.pl',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '',
                customFields: [],
              },
              {
                qty: 0,
                desc: 'Aktualna oferta na lidl.pl',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: 'Aktualna oferta na lidl.pl',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '',
                customFields: [],
              },
              {
                qty: 0,
                desc: 'Nr rej.BDO 000002265',
                unit: '',
                price: '0.000',
                discount: '0.000',
                descClean: 'Nr rej.BDO',
                lineTotal: '0.000',
                confidence: '0.500',
                productCode: '000002265',
                customFields: [],
              },
            ],
          },
        },
      ],
      subTotalConfidence: 0.99,
      taxesConfidence: [],
      discountConfidences: [],
      totalConfidence: 0.7,
      cashConfidence: 0,
      changeConfidence: 0,
      roundingConfidence: 0,
      customFields: {
        URL: '',
        Country: '',
        Currency: '',
        PaymentMethod: '',
        CardLast4Digits: '',
      },
      documentType: 'receipt',
      currency: '',
      otherData: [
        'Lidl sp. z o.o. sp. k.',
        'Mogilska 116',
        '31-445 Kraków',
        ',99 6,99 C',
        'O',
        '29,02',
        '2',
        'NIP 781-18-97-358',
        '2019-05-20',
        'nr wydr. 1349399',
        'PARAGON FISKALNY',
        'BIO BORÓWKA AMERYK.S F 1 * 5,99 5,99 C',
        'Pobierz: www.lidlplus.pl',
        'Aktualna oferta na lidl.pl',
        'Nr rej. BDO 000002265',
        'Adres siedziby sprzedawcy:',
        'ul. Poznanska 48, Jankowice',
        '62-080 Tarnowo Podgórne',
        'Dziekujemy za zakupy w LIDI',
        'Pobierz: www.lidlplus.pl',
        'Aktualna oferta na lidl.pl',
        '-',
        '-',
        '--------------',
        '-',
        '',
      ],
    } as ParsingResult
  }
}
