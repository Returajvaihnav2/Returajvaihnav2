import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import * as fontFile from './ArialFont.js';
import { formatCurrency, formatNumber } from '@angular/common';
import * as moment from 'moment';
import { ContractService } from '../contract/contract.service.js';
import { CommonService } from '../common.service.js';
import * as lodash from 'lodash';
import { BrowserStorageService } from '../../utility/browser-storage.service.js';
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  CountryRegions = [];
  pageLayout = '';
  chargingIntervalList = [];
  currencyList = [];
  IsTrade: boolean;
  GridPerHeadStyle = {};
  GridPerBodyStyle = {};
  DiscountPeriodHeadStyle = {};
  DiscountPeriodBodyStyle = {};
  GridAffiliatesOriginatedInHeadStyle = {};
  GridAffiliatesOriginatedInBodyStyle = {};
  AgentName = '';
  CounterPartyAgentName = '';
  constructor(public contractService: ContractService, private commonService: CommonService,
    private browserStorageService: BrowserStorageService
  ) {

  }

  generatePDF(data, IsTrade = false, IsGenerate = true): any {
    this.IsTrade = IsTrade;
    // #region Init
    const OfferIsBandedTied = (data.Offer && data.Offer.DiscountTypes) ?
      data.Offer.DiscountTypes.filter(x => x.DiscountTypeID === 4).length : 0;
    const BidIsBandedTied = (data.Bid && data.Bid.DiscountTypes) ? data.Bid.DiscountTypes.filter(x => x.DiscountTypeID === 4).length : 0;
    // #region "TDR-488 :-Minimum payment commitment missing from PDF summary"
    const OfferM2MIsBandedTied = (data.Offer && data.Offer.M2M && data.Offer.M2M.BandedTieredM2M &&
      data.Offer.M2M.BandedTieredM2M.length > 0)
      ? data.Offer.M2M.BandedTieredM2M.length : 0;

    const BidM2MIsBandedTied = (data.Bid && data.Bid.M2M && data.Bid.M2M.BandedTieredM2M &&
      data.Bid.M2M.BandedTieredM2M.length > 0)
      ? data.Bid.M2M.BandedTieredM2M.length : 0;
    // #endregion
    // this.pageLayout = '';
    // if (BidIsBandedTied > 0 || OfferIsBandedTied > 0 || OfferM2MIsBandedTied > 0 || BidM2MIsBandedTied > 0) {
    //   this.pageLayout = 'landscape';
    // }
    this.pageLayout = 'landscape';
    const pdf = new jspdf(this.pageLayout);
    pdf.addFileToVFS('arialbd.TTF', fontFile.ArialBold);
    pdf.addFont('arialbd.TTF', 'customBold', 'normal');
    pdf.setFont('customBold');

    pdf.addFileToVFS('Arial.TTF', fontFile.Arial);
    pdf.addFont('Arial.TTF', 'customNormal', 'normal');
    pdf.setFont('customNormal');

    this.GridAffiliatesOriginatedInHeadStyle = {
      minCellWidth: 35, lineWidth: 0.25, overflow: 'linebreak', halign: 'left', fontSize: 9,
      font: 'customBold'

      // textColor: [20, 20, 20],
    };

    this.DiscountPeriodHeadStyle = {
      minCellWidth: 6, lineWidth: 0.25, overflow: 'linebreak', halign: 'left', fontSize: 9,
      font: 'customBold',

      // textColor: [20, 20, 20],
    };
    this.DiscountPeriodBodyStyle = {
      minCellWidth: 6, lineWidth: 0.25, overflow: 'linebreak', halign: 'left', fontSize: 9,
      fontStyle: 'customNormal'
      // textColor: [20, 20, 20],
    };
    this.GridPerHeadStyle = {
      minCellWidth: 10, lineWidth: 0.25, overflow: 'linebreak', halign: 'left', fontSize: 9,
      font: 'customBold',

      // textColor: [20, 20, 20],
    };


    const yOffset = (pdf.internal.pageSize.height / 2);
    const LogoPosition = (this.pageLayout && this.pageLayout === 'landscape') ? ((pdf.internal.pageSize.height / 2) + 15) : (yOffset / 2);
    const logoBase64 = this.browserStorageService.getLocalStorageItem('logoBase64');
    pdf.addImage(logoBase64, 'JPEG', LogoPosition, 5);
    const HeaderStyle = {
      font: 'customBold',
      fontStyle: 'customNormal'
      , fontSize: 9,
      // textColor: [20, 20, 20],
      cellWidth: (pdf.internal.pageSize.width / 9)
    };

    if (data.TradingEntityAgentName) {
      this.AgentName = data.TradingEntityAgentName;
    } else {
      this.AgentName = this.checkExistValue(data, 'TradingEntityName');
    }

    const CounterPartyAgentName = IsTrade ? data.CounterParty[0].CounterPartyAgentName : data.CounterPartyAgentName;
    if (CounterPartyAgentName) {
      this.CounterPartyAgentName = CounterPartyAgentName;
    } else {
      this.CounterPartyAgentName = (IsTrade ? data.CounterParty[0].OperatorName : data.CounterPartyName);
    }


    const item = [];
    if (data.CounterPartyTADIGCodes) {
      data.CounterPartyTADIGCodes = data.CounterPartyTADIGCodes.filter(x => x.IsSelected === true);
    }
    if (data.TradingEntityTADIGCodes) {
      data.TradingEntityTADIGCodes = data.TradingEntityTADIGCodes.filter(x => x.IsSelected === true);
    }
    pdf.autoTable({
      theme: 'plain',
      startY: 41,
      styles: {
        cellPadding: 1,
        fontSize: 9,
        font: 'customNormal',
        // textColor: [20, 20, 20],
      },
      tableWidth: (pdf.internal.pageSize.width) - 20,
      margin: { left: 10, top: 10 },
      columnStyles: {
        2: {
          cellWidth: (pdf.internal.pageSize.width / 6)
        },
        5: {
          cellWidth: (pdf.internal.pageSize.width / 6)
        }
      },
      body: [
        IsTrade ? [
          { content: 'Tritex Trade ID', styles: HeaderStyle },
          { content: ':' },
          { content: IsTrade ? this.checkExistValue(data, 'ReferenceNo') : '' },

          { content: 'Tritex Contract ID', styles: HeaderStyle },
          { content: ':' },
          { content: IsTrade ? '' : this.checkExistValue(data, 'ReferenceNo') }
        ] : [
            { content: 'Tritex Contract ID', styles: HeaderStyle },
            { content: ':' },
            { content: IsTrade ? '' : this.checkExistValue(data, 'ReferenceNo') },

            { content: 'Tritex Trade ID', styles: HeaderStyle },
            { content: ':' },
            { content: IsTrade ? this.checkExistValue(data, 'ReferenceNo') : '' }
          ],
        [
          { content: 'Deal Type', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data, IsTrade ? 'TradeDealType' : 'ContractDealType'), colSpan: 4 }
        ],
        [
          { content: 'Type', styles: HeaderStyle },
          { content: ':' },
          { content: data.TypeName, colSpan: 4 }
        ],
        (data.TypeID === 2) ? [
          { content: 'Direction', styles: HeaderStyle },
          { content: ':' },
          {
            content: (data.DirectionID === 1 ? this.CounterPartyAgentName
              : this.AgentName

            )
              + ' ' + data.UnilateralDirectionName, colSpan: 4
          }
        ] : [],
        [
          { content: '', colSpan: 6 }
        ],

        [
          { content: 'Party A', styles: HeaderStyle },
          { content: ':' },
          { content: this.AgentName },
          { content: 'Party B', styles: HeaderStyle },
          { content: ':' },
          { content: this.CounterPartyAgentName }
        ],
        [
          { content: 'Party A TCID', styles: HeaderStyle },
          { content: ':' },
          { content: data.TradingEntityTCID },
          { content: 'Party B TCID', styles: HeaderStyle },
          { content: ':' },
          { content: IsTrade ? data.CounterParty[0].OperatorTCID : data.CounterPartyTCID }
        ],
        [
          { content: 'Party A TAP Codes', styles: HeaderStyle },
          { content: ':' },
          {
            content: this.checkExistValue(data, 'TradingEntityTADIGCodes', 'Array', 'TadigCode')
          }
          ,
          { content: 'Party B TAP Codes', styles: HeaderStyle },
          { content: ':' },
          {
            content: this.checkExistValue(data, 'CounterPartyTADIGCodes', 'Array', 'TadigCode')
          }
        ],
        [
          { content: '', colSpan: 6 }
        ],

        [
          { content: 'Trade Date', styles: HeaderStyle },
          { content: ':' },
          { content: IsTrade ? this.getDate(new Date()) : this.getDateFormat(data.TradeDate), colSpan: 4 }
        ],
        [
          { content: 'Start Date', styles: HeaderStyle },
          { content: ':' },
          { content: this.getDateFormat(data.StartDate), colSpan: 4 }
        ],

        [
          { content: 'End date', styles: HeaderStyle },
          { content: ':' },
          { content: this.getDateFormat(data.EndDate), colSpan: 4 }
          // { content: this.checkExistValue(data, 'EndDate'), colSpan: 4 }
        ],
        [
          { content: 'Number of Discount Periods', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data, 'NoOfDiscountPeriods'), colSpan: 4 }
        ],
        [
          { content: 'Auto-renew', styles: HeaderStyle },
          { content: ':' },
          { content: data.IsAutoRenewal ? 'Yes' : 'No', colSpan: 4 }
        ],
        data.IsAutoRenewal ? [
          { content: 'Rollover period', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data, 'DiscountPeriodName'), colSpan: 4 }
        ] : [],
        [
          { content: 'Template Name', styles: HeaderStyle },
          { content: ':' },
          {
            content: this.getTemplate(data.TemplateName, data, IsTrade), colSpan: 4
          }
        ],
      ]
    });
    data.DiscountPeriods.forEach(element => {
      item.push([element.DiscountPeriod, this.getDateFormat(element.DiscountPeriodStartDate),
      this.getDateFormat(element.DiscountPeriodEndDate)]);
    });
    pdf.autoTable({
      theme: 'plain',
      margin: { left: 10, top: 10 },
      head: this.getDiscountPeriodHeader((data.DiscountPeriods.length > 1 ? true : false),
        (data.isLongStub === 1) ? true : false),
      tableWidth: (pdf.internal.pageSize.width / 2),
      body: item,
      styles: this.DiscountPeriodBodyStyle,
      didDrawCell: item,
      font: 'customNormal',
    });

    pdf.autoTable({
      theme: 'plain',
      styles: {
        cellPadding: 1,
        fontSize: 9,
        font: 'customNormal',
        // textColor: [20, 20, 20],
      },
      columnStyles: {

        2: {
          cellWidth: (pdf.internal.pageSize.width / 6)
        },
        5: {
          cellWidth: (pdf.internal.pageSize.width / 6)
        }
      },
      pageBreak: (this.pageLayout && this.pageLayout === 'landscape') ? 'avoid' : 'auto',
      tableWidth: (pdf.internal.pageSize.width) - 20,
      margin: { left: 10, top: 10 },
      body: [
        [
          {
            content: 'Discounts for ' + this.AgentName, styles: {
              font: 'customBold',
              fontSize: 9,
              // textColor: [20, 20, 20],
              cellWidth: (pdf.internal.pageSize.width / 9),
              valign: 'middle',
              halign: 'center',

            },
            colSpan: 3
          },

          {
            content: 'Discounts for ' + this.CounterPartyAgentName, styles: {
              font: 'customBold',

              cellWidth: (pdf.internal.pageSize.width / 9),
              valign: 'middle',
              halign: 'center',
              fontSize: 9,

              // textColor: [20, 20, 20],
            },
            colSpan: 3
          },

        ],

        [
          { content: 'Settlement', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data.Offer, 'SettlementTypeName') },
          { content: 'Settlement', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data.Bid, 'SettlementTypeName') }
        ],
        [
          { content: 'Tax Treatment', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data.Offer, 'TaxTreatmentValue') },
          { content: 'Tax Treatment', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data.Bid, 'TaxTreatmentValue') }
        ],
        [
          { content: 'Exclusions Services', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data.Offer, 'Exclusions', 'Array', 'ExclusionName') },
          { content: 'Exclusions Services', styles: HeaderStyle },
          { content: ':' },
          { content: this.checkExistValue(data.Bid, 'Exclusions', 'Array', 'ExclusionName') }
        ],
        [
          { content: 'Exclusion Countries', styles: HeaderStyle },
          { content: ':' },
          {
            content: (data.Offer ? this.checkExistValue(data.Offer.ExclusionsCountryRegion, 'Countries', 'Array', 'CountryName')
              : 'N/A')
          },
          { content: 'Exclusion Countries', styles: HeaderStyle },
          { content: ':' },
          {
            content: (data.Bid ? this.checkExistValue(data.Bid.ExclusionsCountryRegion, 'Countries', 'Array', 'CountryName')
              : 'N/A')
          }
        ],


      ]
    });

    if (data && data.Bid && (data.TypeID === 1 || data.TypeID === 2 && data.DirectionID === 2)) {
      this.CountryRegions = [];
      this.getDiscountGrids(data.Bid, pdf, 'Pricing Grid ' + 'Discounts for ' +
        this.AgentName, IsTrade, data.CounterPartyTADIGCodes);
    }

    if (data && data.Offer && (data.TypeID === 1 || data.TypeID === 2 && data.DirectionID === 1)) {
      this.CountryRegions = [];
      this.getDiscountGrids(data.Offer, pdf, 'Pricing Grid ' + 'Discounts for ' +
        this.CounterPartyAgentName, IsTrade,
        data.TradingEntityTADIGCodes);
    }

    this.setPageNo(pdf);
    // pdf.save(data.ReferenceNo + '.pdf');

    if (IsGenerate) {
      pdf.save(data.ReferenceNo + '.pdf');
      return '';
    } else {
      return pdf.output('datauristring').replace('data:application/pdf;filename=generated.pdf;base64,', '');
    }
    // //#endregion

  }


  getDiscountGrids(data, pdf, value, IsTrade, AmandTapList) {
    pdf.autoTable({
      theme: 'plain',
      styles: {
        overflow: 'linebreak',
        halign: 'left',
        font: 'customBold',
        fontStyle: 'customNormal',
        fontSize: 16,

        // textColor: [20, 20, 20],
      },
      tableWidth: (pdf.internal.pageSize.width) - 20,
      margin: { left: 10, top: 10 },
      body:
        [
          { content: value }
        ]
    });
    // #region "TDR-488 :-Minimum payment commitment missing from PDF summary"
    if (data.MinimumPaymentCommitment && data.MinimumPaymentCommitment.length > 0) {
      this.getMinimumPaymentCommitment(data.MinimumPaymentCommitment, pdf, IsTrade);
    }
    if (data.MarketShare && data.MarketShare.length > 0) {
      this.getMarketShare(data.MarketShare, pdf, IsTrade);
    }
    if (data.VolumeConditionalCommitment && data.VolumeConditionalCommitment.length > 0) {
      this.getVolumeConditionalCommitment(data.VolumeConditionalCommitment, pdf, IsTrade);
    }
    // #endregion
    if (data.Financial && data.Financial.length > 0) {
      this.getAYCEGrid(data.Financial, pdf, IsTrade);
    }
    if (data.FlatRate && data.FlatRate.length > 0) {
      this.getFlatRateGrid(data.FlatRate, pdf, IsTrade);
    }
    if (data.BalancedUnbalanced && data.BalancedUnbalanced.length > 0) {
      this.getBalancedUnbalancedGrid(data.BalancedUnbalanced, pdf, IsTrade);
    }
    if (data.BandedTiered && data.BandedTiered.length > 0) {
      this.getBandedTieredGrid(data.BandedTiered, pdf, IsTrade);
    }
    if (data.DiscountInvoice && data.DiscountInvoice.length > 0) {
      this.getDiscountInvoice(data.DiscountInvoice, pdf, IsTrade);
    }
    if (data.FinancialWithFair && data.FinancialWithFair.length > 0) {
      this.getFinancialWithFair(data.FinancialWithFair, pdf, IsTrade);
    }
    if (data.FinancialDiscountFair && data.FinancialDiscountFair.length > 0) {
      this.getFinancialDiscountFair(data.FinancialDiscountFair, pdf, IsTrade);
    }

    if (this.CountryRegions && this.CountryRegions.length > 0) {
      const CountryRegionsHeader = [
        [
          {
            content: 'Voice MO Termination Definitions', colSpan: 2, styles: { halign: 'left', font: 'customNormal' }
          }
        ],
        [
          {
            content: 'Region', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Countries', styles: this.GridAffiliatesOriginatedInHeadStyle
          },

        ],

      ];
      this.CountryRegions = lodash.uniqBy(this.CountryRegions, 0);
      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          0: {
            cellWidth: (pdf.internal.pageSize.width / 16)
          },
          1: {
            cellWidth: (pdf.internal.pageSize.width / 3)
          }
        },
        margin: { left: 10, top: 10 },
        head: CountryRegionsHeader,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: this.CountryRegions,
        styles: this.DiscountPeriodBodyStyle,
        didDrawCell: this.CountryRegions,
      });
    }
    // #region "TDR-488 :-Minimum payment commitment missing from PDF summary"
    if (data.M2M && data.IsIncludeM2M) {
      const HeaderStyle = {
        font: 'customNormal', fontSize: 9,

        // textColor: [20, 20, 20],
        cellWidth: (pdf.internal.pageSize.width / 9)
      };

      pdf.autoTable({
        theme: 'plain',
        styles: {
          overflow: 'linebreak',
          halign: 'left',
          font: 'customBold', fontSize: 16,

          // textColor: [20, 20, 20],
        },
        tableWidth: (pdf.internal.pageSize.width) - 20,
        margin: { left: 10, top: 10 },
        body:
          [
            { content: 'M-IoT' }
          ]
      });
      if (this.IsTrade) {

        const CheckHeader = [
          [
            {
              content: 'TAP', colSpan: 1, styles: {
                halign: 'left', font: 'customBold',
                fontStyle: 'customNormal'
              }
            },
            {
              content: 'IMSI', colSpan: 1, styles: {
                halign: 'left', font: 'customBold',
                fontStyle: 'customNormal'
              }
            },
            {
              content: 'APN', colSpan: 1, styles: {
                halign: 'left', font: 'customBold',
                fontStyle: 'customNormal'
              }
            }
          ]

        ];
        const CheckBody = [];
        CheckBody.push([data.M2M.IsTAP ? 'Yes' : 'No', data.M2M.IsIMSI ? 'Yes' : 'No', data.M2M.IsAPN ? 'Yes' : 'No'
        ]);


        pdf.autoTable({
          theme: 'plain',
          styles: {
            overflow: 'linebreak',
            halign: 'left',
            fontSize: 9,
            lineWidth: 0.25,
            font: 'customNormal'
            // textColor: [20, 20, 20],
          },
          margin: { left: 10, top: 10 },
          head: CheckHeader,
          pageBreak: 'auto',
          showHead: 'firstPage',
          tableWidth: (pdf.internal.pageSize.width) - 20,
          body: CheckBody
        });

      }

      // #region TAPCodeList
      if (data.M2M.IsTAP && data.M2M.TAPCodeList && this.IsTrade) {
        this.getTap(data, pdf, AmandTapList);
      }
      // #endregion

      // #region APN
      if (data.M2M.IsAPN && data.M2M.TAPCodeList && this.IsTrade) {
        this.getApn(data, pdf, AmandTapList);
      }
      ////#endregion

      pdf.autoTable({
        theme: 'plain',
        styles: {
          overflow: 'linebreak',
          halign: 'left',
          font: 'customBold',
          fontSize: 16,

          // textColor: [20, 20, 20],
        },
        tableWidth: (pdf.internal.pageSize.width) - 20,
        margin: { left: 10, top: 10 },
        body:
          [
            { content: 'M-IoT Pricing Grid ', }
          ]
      });

      if (data.M2M && data.M2M.AccessFeeM2M && data.M2M.AccessFeeM2M.length > 0) {
        this.getAccessFee(data.M2M.AccessFeeM2M, pdf);
      }
      if (data.M2M && data.M2M.MinimumPaymentCommitmentM2M && data.M2M.MinimumPaymentCommitmentM2M.length > 0) {
        this.getMinimumPaymentCommitment(data.M2M.MinimumPaymentCommitmentM2M, pdf, this.IsTrade, true);
      }

      if (data.M2M && data.M2M.FinancialM2M && data.M2M.FinancialM2M.length > 0) {
        this.getAYCEGrid(data.M2M.FinancialM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.FlatRateM2M && data.M2M.FlatRateM2M.length > 0) {
        this.getFlatRateGrid(data.M2M.FlatRateM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.BalancedUnbalancedM2M && data.M2M.BalancedUnbalancedM2M.length > 0) {
        this.getBalancedUnbalancedGrid(data.M2M.BalancedUnbalancedM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.BandedTieredM2M && data.M2M.BandedTieredM2M.length > 0) {
        this.getBandedTieredGrid(data.M2M.BandedTieredM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.VolumeConditionalCommitmentM2M && data.M2M.VolumeConditionalCommitmentM2M.length > 0) {
        this.getVolumeConditionalCommitment(data.M2M.VolumeConditionalCommitmentM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.MarketShareM2M && data.M2M.MarketShareM2M.length > 0) {
        this.getMarketShare(data.M2M.MarketShareM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.DiscountInvoiceM2M && data.M2M.DiscountInvoiceM2M.length > 0) {
        this.getDiscountInvoice(data.M2M.DiscountInvoiceM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.FinancialWithFairM2M && data.M2M.FinancialWithFairM2M.length > 0) {
        this.getFinancialWithFair(data.M2M.FinancialWithFairM2M, pdf, IsTrade, true);
      }
      if (data.M2M && data.M2M.FinancialDiscountFairM2M && data.M2M.FinancialDiscountFairM2M.length > 0) {
        this.getFinancialDiscountFair(data.M2M.FinancialDiscountFairM2M, pdf, IsTrade, true);
      }

    }
    // #endregion
  }

  getAccessFee(AccessFeeData, pdf) {
    if (this.IsTrade) {
      const AcessFeeHeader = [
        [
          {
            content: 'Access Fee', colSpan: 6, styles: {
              halign: 'center', font: 'customBold'
            }
          }
        ],
        [
          {
            content: 'Applies To', colSpan: 1, styles: {
              halign: 'left', font: 'customBold'
            }
          },
          {
            content: 'Roaming On', colSpan: 1, styles: {
              halign: 'left', font: 'customBold'
            }
          },
          {
            content: 'Service', colSpan: 1, styles: {
              halign: 'left', font: 'customBold'
            }
          },
          {
            content: 'Currency', colSpan: 1, styles: {
              halign: 'left', font: 'customBold'
            }
          },
          {
            content: 'Rate per IMSI', colSpan: 1, styles: {
              halign: 'left', font: 'customBold'
            }
          }
          ,
          {
            content: 'Charging Interval', colSpan: 1, styles: {
              halign: 'left', font: 'customBold'
            }
          }
          //  IMSI
        ]
      ];
      const AcessFeeBody = [];
      AccessFeeData.forEach(period => {
        if (period && period.length > 0) {
          period.forEach(AccessFee => {
            AcessFeeBody.push([
              this.IsTrade ? AccessFee.AppliesToCode : AccessFee.AppliesToCode.map(x => x.TadigCode),
              this.IsTrade ? AccessFee.RoamingOnCode : AccessFee.RoamingOnCode.map(x => x.CountryName),
              AccessFee.ServiceName,
              AccessFee.ISO,
              AccessFee.RatePerIMSI,
              AccessFee.ChargeIntervalNAME
            ]);
          });
        }
      });

      pdf.autoTable({
        theme: 'plain',
        styles: {
          overflow: 'linebreak',
          halign: 'left',
          fontSize: 9,
          lineWidth: 0.25,
          fontStyle: 'customNormal'
          // textColor: [20, 20, 20],
        },
        margin: { left: 10, top: 10 },
        head: AcessFeeHeader,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: AcessFeeBody
      });
    }
  }

  getTap(data, pdf, AmandTapList) {
    const TAPCodeHeader = [
      [
        {
          content: 'TAP Code', styles: {
            halign: 'center', font: 'customBold',
            fontStyle: 'customNormal'
          }
        }
      ]

    ];
    const TapCodeBody = [];

    data.M2M.TAPCodeList.forEach((element, index) => {
      const item = AmandTapList.filter(x => x.TadigId === element);
      TapCodeBody.push([
        item[0].TadigCode
      ]);
    });
    pdf.autoTable({
      theme: 'plain',
      styles: {
        overflow: 'linebreak',
        halign: 'left',
        fontSize: 9,
        font: 'customBold',
        fontStyle: 'customNormal',
        // textColor: [20, 20, 20],
        lineWidth: 0.25,
      },
      tableWidth: (pdf.internal.pageSize.width / 2),
      columnStyles: {

        2: {
          cellWidth: (pdf.internal.pageSize.width / 6)
        },
        5: {
          cellWidth: (pdf.internal.pageSize.width / 6)
        }
      },
      head: TAPCodeHeader,
      pageBreak: (this.pageLayout && this.pageLayout === 'landscape') ? 'avoid' : 'auto',
      margin: { left: 10, top: 10 },
      body: TapCodeBody
    });
  }

  getApn(data, pdf, AmandTapList) {

    const APNHeader = [
      [
        {
          content: 'APN', colSpan: 2, styles: {
            halign: 'center', font: 'customBold',
            fontStyle: 'customNormal'
          }
        }
      ],
      [
        {
          content: 'TAP Code', colSpan: 1, styles: {
            halign: 'left', font: 'customBold',
            fontStyle: 'customNormal'
          }
        },
        {
          content: 'APN', colSpan: 1, styles: {
            halign: 'left', font: 'customBold',
            fontStyle: 'customNormal'
          }
        }
      ]
    ];
    const ApnBody = [];

    data.M2M.APNList.forEach((element, index) => {
      // const item = AmandTapList.filter(x => x.TadigId === element.TADIGID);
      ApnBody.push([element.TADIGCode, element.APNCode]);
    });

    pdf.autoTable({
      theme: 'plain',
      styles: {
        overflow: 'linebreak',
        halign: 'left',
        fontSize: 9,
        font: 'customBold',
        fontStyle: 'customNormal',
        // textColor: [20, 20, 20],
        lineWidth: 0.25,
      },
      margin: { left: 10, top: 10 },
      head: APNHeader,
      pageBreak: 'auto',
      showHead: 'firstPage',
      tableWidth: (pdf.internal.pageSize.width) - 20,
      body: ApnBody
    });

  }
  // #region "TDR-488 :-Minimum payment commitment missing from PDF summary"
  getMinimumPaymentCommitment(MinimumPaymentCommitment, pdf, IsTrade, IsM2M = false) {
    MinimumPaymentCommitment.forEach((el, index) => {
      const PricingGridHeader = [
        [
          {
            content: 'Minimum Payment Commitment', colSpan: 4, styles: {
              halign: 'center', font: 'customBold',
            }
          }
        ],
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 4, styles: {
              halign: 'left', font: 'customBold',
            }
          }
        ],
        [
          {
            content: 'Applies To', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Roaming On', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Commitment', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const PricingGridHeader1 = [
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 4, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Applies To', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Roaming On', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Commitment', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const itemlist = [];
      el.filter(x => x.isExclude === 0).forEach(element => {
        itemlist.push([IsTrade ? element.AppliesToCode : element.AppliesTo.map(x => x.TadigCode),
        IsTrade ? element.RoamingOnCode : element.RoamingOn.map(x => x.CountryName),
        element.ISO,
        element.Commitment || element.Commitment === 0 ? element.Commitment : '']);
      });

      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          0: {
            cellWidth: (pdf.internal.pageSize.width / 4)
          },
          1: {
            cellWidth: (pdf.internal.pageSize.width / 4)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 7)
          },
          3: {
            cellWidth: (pdf.internal.pageSize.width / 4)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        font: 'customNormal',
        styles: this.DiscountPeriodBodyStyle
      });

    });

  }
  getMarketShare(MarketShare, pdf, IsTrade, IsM2M = false) {
    MarketShare.forEach((el, index) => {
      const PricingGridHeader = [
        [
          {
            content: 'Market Share', colSpan: 3, styles: {
              halign: 'center', font: 'customBold',
            }
          }
        ],
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 3, styles: {
              halign: 'left', font: 'customBold',
            }
          }
        ],
        [
          {
            content: 'Applies To', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Roaming On', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          // {
          //   content: 'Currency', styles: this.GridPerHeadStyle
          // }
          // ,
          {
            content: 'Volume Market Share', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const PricingGridHeader1 = [
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 3, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Applies To', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Roaming On', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          // {
          //   content: 'Currency', styles: this.GridPerHeadStyle
          // }
          // ,
          {
            content: 'Volume Market Share', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const itemlist = [];
      el.filter(x => x.isExclude === 0).forEach(element => {
        itemlist.push([IsTrade ? element.AppliesToCode : element.AppliesTo.map(x => x.TadigCode),
        IsTrade ? element.RoamingOnCode : element.RoamingOn.map(x => x.CountryName),
        // element.ISO,
        element.VolumePercentage ? element.VolumePercentage : '']);
      });

      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          0: {
            cellWidth: (pdf.internal.pageSize.width / 3)
          },
          1: {
            cellWidth: (pdf.internal.pageSize.width / 3)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 7)
          },

        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        font: 'customNormal',
        styles: this.DiscountPeriodBodyStyle
      });

    });

  }
  getVolumeConditionalCommitment(VolumeConditionalCommitment, pdf, IsTrade, IsM2M = false) {
    VolumeConditionalCommitment.forEach((el, index) => {
      const PricingGridHeader = [
        [
          {
            content: 'Volume Conditional Commitment', colSpan: 6, styles: {
              halign: 'center', font: 'customBold',
            }
          }
        ],
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 6, styles: {
              halign: 'left', font: 'customBold',
            }
          }
        ],
        [
          {
            content: 'Applies To', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Roaming On', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Service', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Volume', styles: this.GridPerHeadStyle
          },
          {
            content: 'Per', styles: this.GridPerHeadStyle
          },
          {
            content: 'Interval', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const PricingGridHeader1 = [
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 6, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Applies To', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Roaming On', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Service', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Volume', styles: this.GridPerHeadStyle
          },
          {
            content: 'Per', styles: this.GridPerHeadStyle
          },
          {
            content: 'Interval', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const itemlist = [];
      el.filter(x => x.isExclude === 0).forEach(element => {
        itemlist.push([IsTrade ? element.AppliesToCode : element.AppliesTo.map(x => x.TadigCode),
        IsTrade ? element.RoamingOnCode : element.RoamingOn.map(x => x.CountryName),
        element.ServiceName,
        element.Volume ? element.Volume : '',
        element.PerUnitName,
        element.ChargingIntervalName
        ]);
      });

      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          0: {
            cellWidth: (pdf.internal.pageSize.width / 6)
          },
          1: {
            cellWidth: (pdf.internal.pageSize.width / 6)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 7)
          },
          3: {
            cellWidth: (pdf.internal.pageSize.width / 4)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        font: 'customNormal',
        styles: this.DiscountPeriodBodyStyle
      });

    });

  }

  // #endregion
  getAYCEGrid(Financial, pdf, IsTrade, IsM2M = false) {
    Financial.forEach((el, index) => {
      const PricingGridHeader = [
        [
          {
            content: 'All You Can Eat', colSpan: 5, styles: { halign: 'center', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 5, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Service', styles: this.GridPerHeadStyle
          },
          {
            content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'AYCERate', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const PricingGridHeader1 = [
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 5, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Service', styles: this.GridPerHeadStyle
          },
          {
            content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
          },

          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'AYCERate', styles: this.GridPerHeadStyle
          }

        ],

      ];
      const itemlist = [];
      el.filter(x => x.isExclude === 0).forEach(element => {
        itemlist.push([IsTrade ? element.ServicesName : element.Services.map(x => x.ServiceName),
        IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
        IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
        element.ISO, this.convertDecimalFormat(element.AYCERate)]);
      });

      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          1: {
            cellWidth: (pdf.internal.pageSize.width / 5)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 5)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        styles: this.DiscountPeriodBodyStyle,
        font: 'customNormal',
      });

    });

  }

  getFlatRateGrid(FlatRate, pdf, IsTrade, IsM2M = false) {
    FlatRate.forEach((el, index) => {
      let PricingGridHeader1: any = [];
      let PricingGridHeader: any = [];
      const itemlist = [];
      if (IsM2M) {
        PricingGridHeader = [
          [
            {
              content: 'Flat Rate', colSpan: 7, styles: { halign: 'center', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 8, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },

            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 7, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },

            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          itemlist.push([element.ServiceName, (IsTrade) ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
          IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
          element.ISO, this.convertDecimalFormat(element.TrafficRate),
          element.PerUnitName, element.ChargingIntervalName]);
        });
      } else {
        PricingGridHeader = [
          [
            {
              content: 'Flat Rate', colSpan: 8, styles: { halign: 'center', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 8, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 8, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];

        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          itemlist.push([element.ServiceName, (IsTrade) ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
          IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
          element.TerminatedName, element.ISO, this.convertDecimalFormat(element.TrafficRate),
          element.PerUnitName, element.ChargingIntervalName]);
        });
      }
      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          1: {
            cellWidth: (pdf.internal.pageSize.width / 8)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 8)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        styles: this.DiscountPeriodBodyStyle,
        didDrawCell: itemlist,
        font: 'customNormal',
      });

    });

  }

  getBalancedUnbalancedGrid(BalancedUnbalanced, pdf, IsTrade, IsM2M = false) {
    BalancedUnbalanced.forEach((el, index) => {
      let PricingGridHeader1: any = [];
      let PricingGridHeader: any = [];
      const itemlist = [];
      if (IsM2M) {
        PricingGridHeader = [
          [
            {
              content: 'Balanced / Unbalanced', colSpan: 8, styles: { halign: 'center' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 8, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Balanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'Unbalanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 8, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Balanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'Unbalanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          itemlist.push([element.ServiceName, IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
          IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
          element.ISO, this.convertDecimalFormat(element.BalancedTrafficRate),
          this.convertDecimalFormat(element.UnbalancedTrafficRate), element.PerUnitName,
          element.ChargingIntervalName]);
        });
      } else {
        PricingGridHeader = [
          [
            {
              content: 'Balanced / Unbalanced', colSpan: 9, styles: { halign: 'center' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 9, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Balanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'Unbalanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 9, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Balanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'Unbalanced Traffic rate', styles: this.GridPerHeadStyle
            },
            {
              content: 'per', styles: this.GridPerHeadStyle
            },
            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          itemlist.push([element.ServiceName, IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
          IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
          element.TerminatedName, element.ISO, this.convertDecimalFormat(element.BalancedTrafficRate),
          this.convertDecimalFormat(element.UnbalancedTrafficRate), element.PerUnitName,
          element.ChargingIntervalName]);
        });
      }
      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          1: {
            cellWidth: (pdf.internal.pageSize.width / 9)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 9)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        styles: this.DiscountPeriodBodyStyle,
        font: 'customNormal',
      });

    });

  }

  getBandedTieredGrid(BandedTiered, pdf, IsTrade, isM2M = false) {
    BandedTiered.forEach((el, index) => {
      let PricingGridHeader1: any = [];
      let PricingGridHeader: any = [];
      const itemlist = [];
      if (isM2M) {
        PricingGridHeader = [
          [
            {
              content: 'Banded / Tiered', colSpan: 14, styles: { halign: 'center', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 14, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },

            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold Type', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic Rate', styles: this.GridPerHeadStyle
            },

            {
              content: '  \u003E\u003D  ', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Back To First', styles: this.GridPerHeadStyle
            },

            {
              content: 'per', styles: this.GridPerHeadStyle
            },


            {
              content: 'Interval', styles: this.GridPerHeadStyle
            },
            {
              content: 'Calculated', styles: this.GridPerHeadStyle
            },
            {
              content: 'Calculation Type', styles: this.GridPerHeadStyle
            },
            {
              content: 'IMSI Fee', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 14, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },

            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold Type', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic Rate', styles: this.GridPerHeadStyle
            },

            {
              content: '\u003E\u003D', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Back To First', styles: this.GridPerHeadStyle
            },

            {
              content: 'per ', styles: this.GridPerHeadStyle
            },


            {
              content: 'Interval', styles: this.GridPerHeadStyle
            },
            {
              content: 'Calculated', styles: this.GridPerHeadStyle
            },
            {
              content: 'Calculation Type', styles: this.GridPerHeadStyle
            },
            {
              content: 'IMSI Fee', styles: this.GridPerHeadStyle
            }
          ]

        ];


        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          element.Bands.forEach((elementItem, i) => {
            if (element.Bands.length > 1) {
              if (i === 0) {
                itemlist.push([
                  {
                    content: element.ServiceName, rowSpan: element.Bands.length
                  },
                  {
                    content: IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
                    rowSpan: element.Bands.length
                  },
                  {
                    content: IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
                    rowSpan: element.Bands.length
                  },
                  {
                    content: element.ISO, rowSpan: element.Bands.length
                  }, {
                    content: elementItem.BandThresholdTypeName
                  },
                  {
                    content: this.convertDecimalFormat(elementItem.TrafficRate),
                  },
                  {
                    content: '\u003E\u003D'
                  },
                  {

                    content: elementItem.BandThresholdTypeName !== 'Commitment' ?
                      (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                        this.convertCurruncyFormat(elementItem.BandThreshold)) : ''
                  },
                  {
                    content: (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
                  },
                  {
                    content: element.PerUnitName, rowSpan: element.Bands.length
                  },
                  {
                    content: element.ChargingIntervalName, rowSpan: element.Bands.length
                  },
                  {
                    content: element.ThresholdCalculatedName
                  },
                  {
                    content: element.ThresholdCalculationTypeName
                  },
                  {
                    content: element.IMSIApplicationFeeName
                  },
                ]);
              } else {
                itemlist.push([
                  elementItem.BandThresholdTypeName,
                  this.convertDecimalFormat(elementItem.TrafficRate),
                  '\u003E\u003D',
                  elementItem.BandThresholdTypeName !== 'Commitment' ?
                    (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                      this.convertCurruncyFormat(elementItem.BandThreshold)) : '',
                  (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
                ]);
              }
            } else {
              itemlist.push([
                {
                  content: element.ServiceName
                },
                {
                  content: IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode)
                },
                {
                  content: IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName)
                },
                {
                  content: element.ISO
                },
                {
                  content: elementItem.BandThresholdTypeName,
                },
                {
                  content: this.convertDecimalFormat(elementItem.TrafficRate),
                },
                {
                  content: '\u003E\u003D'
                },
                {
                  content: elementItem.BandThresholdTypeName !== 'Commitment' ?
                    (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                      this.convertCurruncyFormat(elementItem.BandThreshold)) : ''
                },
                {
                  content: (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
                },
                {
                  content: element.PerUnitName
                },
                {
                  content: element.ChargingIntervalName
                },
                {
                  content: element.ThresholdCalculatedName
                },
                {
                  content: element.ThresholdCalculationTypeName
                },
                {
                  content: element.IMSIApplicationFeeName
                },
              ]);
            }

          });

        });

      } else {
        PricingGridHeader = [
          [
            {
              content: 'Banded / Tiered', colSpan: 12, styles: { halign: 'center', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 12, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold Type', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic Rate', styles: this.GridPerHeadStyle
            },

            {
              content: '  \u003E\u003D  ', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Back To First', styles: this.GridPerHeadStyle
            },

            {
              content: 'per', styles: this.GridPerHeadStyle
            },


            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 12, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },
            {
              content: 'Currency', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold Type', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Traffic Rate', styles: this.GridPerHeadStyle
            },

            {
              content: '\u003E\u003D', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Band Threshold', styles: this.GridPerHeadStyle
            }
            ,
            {
              content: 'Back To First', styles: this.GridPerHeadStyle
            },

            {
              content: 'per ', styles: this.GridPerHeadStyle
            },


            {
              content: 'Interval', styles: this.GridPerHeadStyle
            }
          ]

        ];

        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          element.Bands.forEach((elementItem, i) => {
            if (element.Bands.length > 1) {
              if (i === 0) {
                itemlist.push([
                  {
                    content: element.ServiceName, rowSpan: element.Bands.length
                  },
                  {
                    content: IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
                    rowSpan: element.Bands.length
                  },
                  {
                    content: IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
                    rowSpan: element.Bands.length
                  },
                  {
                    content: element.TerminatedName, rowSpan: element.Bands.length
                  },
                  {
                    content: element.ISO, rowSpan: element.Bands.length
                  }, {
                    content: elementItem.BandThresholdTypeName
                  },
                  {
                    content: this.convertDecimalFormat(elementItem.TrafficRate),
                  },
                  {
                    content: '\u003E\u003D'
                  },
                  {

                    content: elementItem.BandThresholdTypeName !== 'Commitment' ?
                      (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                        this.convertCurruncyFormat(elementItem.BandThreshold)) : ''
                  },
                  {
                    content: (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
                  },
                  {
                    content: element.PerUnitName, rowSpan: element.Bands.length
                  },
                  {
                    content: element.ChargingIntervalName, rowSpan: element.Bands.length
                  }
                ]);
              } else {
                itemlist.push([
                  elementItem.BandThresholdTypeName,
                  this.convertDecimalFormat(elementItem.TrafficRate),
                  '\u003E\u003D',
                  elementItem.BandThresholdTypeName !== 'Commitment' ?
                    (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                      this.convertCurruncyFormat(elementItem.BandThreshold)) : '',
                  (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
                ]);
              }
            } else {
              itemlist.push([
                {
                  content: element.ServiceName
                },
                {
                  content: IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode)
                },
                {
                  content: IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName)
                },
                {
                  content: element.TerminatedName
                },
                {
                  content: element.ISO
                },
                {
                  content: elementItem.BandThresholdTypeName,
                },
                {
                  content: this.convertDecimalFormat(elementItem.TrafficRate),
                },
                {
                  content: '\u003E\u003D'
                },
                {
                  content: elementItem.BandThresholdTypeName !== 'Commitment' ?
                    (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                      this.convertCurruncyFormat(elementItem.BandThreshold)) : ''
                },
                {
                  content: (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
                },
                {
                  content: element.PerUnitName
                },
                {
                  content: element.ChargingIntervalName
                }]);
            }

          });

        });


      }
      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          0: {
            cellWidth: (pdf.internal.pageSize.width / 17)
          },
          1: {
            cellWidth: (pdf.internal.pageSize.width / 10)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 10)
          },
          3: {
            cellWidth: (pdf.internal.pageSize.width / 20)
          },
          4: {
            cellWidth: (pdf.internal.pageSize.width / 17)
          },
          5: {
            cellWidth: (pdf.internal.pageSize.width / 17)
          }, 6: {
            cellWidth: (pdf.internal.pageSize.width / 12)
          },
          10: {
            cellWidth: (pdf.internal.pageSize.width / 21)
          },
          11: {
            cellWidth: (pdf.internal.pageSize.width / 21)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        styles: this.DiscountPeriodBodyStyle,
        didDrawCell: itemlist,
        font: 'customNormal',
      });

    });

  }
  getDiscountInvoice(DiscountInvoice, pdf, IsTrade, IsM2M = false) {
    DiscountInvoice.forEach((el, index) => {
      let PricingGridHeader1: any = [];
      let PricingGridHeader: any = [];
      const itemlist = [];
      if (IsM2M) {
        PricingGridHeader = [
          [
            {
              content: 'Discount Invoice', colSpan: 4, styles: { halign: 'center', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 4, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },

            {
              content: 'Discount on Invoice(%)', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 4, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },


            {
              content: 'Discount on Invoice(%)', styles: this.GridPerHeadStyle
            }
          ],

        ];
        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          itemlist.push([element.ServiceName, (IsTrade) ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
          IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
          element.DiscountPercentage]);
        });
      } else {
        PricingGridHeader = [
          [
            {
              content: 'Discount Invoice', colSpan: 5, styles: { halign: 'center', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 5, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },

            {
              content: 'Discount on Invoice(%)', styles: this.GridPerHeadStyle
            }
          ],

        ];
        PricingGridHeader1 = [
          [
            {
              content: 'Discount Period ' + (index + 1), colSpan: 5, styles: { halign: 'left', font: 'customBold' }
            }
          ],
          [
            {
              content: 'Service', styles: this.GridPerHeadStyle
            },
            {
              content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
            },
            {
              content: 'Terminated In', styles: this.GridPerHeadStyle
            },

            {
              content: 'Discount on Invoice(%)', styles: this.GridPerHeadStyle
            }
          ],

        ];
        el.filter(x => x.isExclude === 0).forEach(element => {
          this.mapRegionCountry(element);
          itemlist.push([element.ServiceName, (IsTrade) ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
          IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
          element.TerminatedName, element.DiscountPercentage]);
        });
      }
      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          1: {
            cellWidth: (pdf.internal.pageSize.width / 5)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 5)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        styles: this.DiscountPeriodBodyStyle,
        didDrawCell: itemlist,
        font: 'customNormal',
      });

    });

  }

  getFinancialWithFair(FinancialWithFair, pdf, IsTrade, IsM2M = false) {
    FinancialWithFair.forEach((el, index) => {

      const PricingGridHeader = [
        [
          {
            content: 'All You Can Eat with Fair USE CAP', colSpan: 8, styles: { halign: 'center', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 8, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Service', styles: this.GridPerHeadStyle
          },
          {
            content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'AYCE Value', styles: this.GridPerHeadStyle
          },
          {
            content: 'Fair USE CAP', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Per', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Interval', styles: this.GridPerHeadStyle
          }
        ],

      ];
      const PricingGridHeader1 = [
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 8, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Service', styles: this.GridPerHeadStyle
          },
          {
            content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'AYCE Value', styles: this.GridPerHeadStyle
          },
          {
            content: 'Fair USE CAP', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Per', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Interval', styles: this.GridPerHeadStyle
          }
        ],

      ];
      const itemlist = [];
      el.filter(x => x.isExclude === 0).forEach(element => {
        itemlist.push([element.ServiceName,
        IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
        IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
        element.ISO,
        this.convertDecimalFormat(element.AYCERate),
        this.convertDecimalFormat(element.FairUseCAP),
        element.PerUnitName,
        element.ChargingIntervalName
        ]);
      });

      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          1: {
            cellWidth: (pdf.internal.pageSize.width / 8)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 8)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        styles: this.DiscountPeriodBodyStyle,
        font: 'customNormal',
      });

    });
  }

  getFinancialDiscountFair(FinancialDiscountFair, pdf, IsTrade, IsM2M = false) {
    FinancialDiscountFair.forEach((el, index) => {
      const PricingGridHeader = [
        [
          {
            content: 'Discount above Fair USE CAP', colSpan: 11, styles: { halign: 'center', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 11, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Service', styles: this.GridPerHeadStyle
          },
          {
            content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
          },

          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Band Threshold Type', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Traffic Rate', styles: this.GridPerHeadStyle
          },

          {
            content: '  \u003E\u003D  ', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Band Threshold', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Back To First', styles: this.GridPerHeadStyle
          },

          {
            content: 'per', styles: this.GridPerHeadStyle
          },


          {
            content: 'Interval', styles: this.GridPerHeadStyle
          }
        ],

      ];
      const PricingGridHeader1 = [
        [
          {
            content: 'Discount Period ' + (index + 1), colSpan: 11, styles: { halign: 'left', font: 'customBold' }
          }
        ],
        [
          {
            content: 'Service', styles: this.GridPerHeadStyle
          },
          {
            content: 'Affiliates', styles: this.GridAffiliatesOriginatedInHeadStyle
          },
          {
            content: 'Originated In', styles: this.GridAffiliatesOriginatedInHeadStyle
          },

          {
            content: 'Currency', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Band Threshold Type', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Traffic Rate', styles: this.GridPerHeadStyle
          },

          {
            content: '\u003E\u003D', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Band Threshold', styles: this.GridPerHeadStyle
          }
          ,
          {
            content: 'Back To First', styles: this.GridPerHeadStyle
          },

          {
            content: 'per ', styles: this.GridPerHeadStyle
          },


          {
            content: 'Interval', styles: this.GridPerHeadStyle
          }
        ]

      ];

      const itemlist = [];
      el.filter(x => x.isExclude === 0).forEach(element => {
        this.mapRegionCountry(element);
        element.Bands.forEach((elementItem, i) => {
          if (element.Bands.length > 1) {
            if (i === 0) {
              itemlist.push([
                {
                  content: element.ServiceName, rowSpan: element.Bands.length
                },
                {
                  content: IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode),
                  rowSpan: element.Bands.length
                },
                {
                  content: IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName),
                  rowSpan: element.Bands.length
                },

                {
                  content: element.ISO, rowSpan: element.Bands.length
                }, {
                  content: elementItem.BandThresholdTypeName
                },
                {
                  content: this.convertDecimalFormat(elementItem.TrafficRate),
                },
                {
                  content: '\u003E\u003D'
                },
                {

                  content: elementItem.BandThresholdTypeName !== 'Commitment' ?
                    (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                      this.convertCurruncyFormat(elementItem.BandThreshold)) : ''
                },
                {
                  content: (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
                },
                {
                  content: element.PerUnitName, rowSpan: element.Bands.length
                },
                {
                  content: element.ChargingIntervalName, rowSpan: element.Bands.length
                }
              ]);
            } else {
              itemlist.push([
                elementItem.BandThresholdTypeName,
                this.convertDecimalFormat(elementItem.TrafficRate),
                '\u003E\u003D',
                elementItem.BandThresholdTypeName !== 'Commitment' ?
                  (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                    this.convertCurruncyFormat(elementItem.BandThreshold)) : '',
                (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
              ]);
            }
          } else {
            itemlist.push([
              {
                content: element.ServiceName
              },
              {
                content: IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode)
              },
              {
                content: IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName)
              },

              {
                content: element.ISO
              },
              {
                content: elementItem.BandThresholdTypeName,
              },
              {
                content: this.convertDecimalFormat(elementItem.TrafficRate),
              },
              {
                content: '\u003E\u003D'
              },
              {
                content: elementItem.BandThresholdTypeName !== 'Commitment' ?
                  (elementItem.BandThresholdTypeName !== 'Volume' ? this.convertDecimalFormat(elementItem.BandThreshold) :
                    this.convertCurruncyFormat(elementItem.BandThreshold)) : ''
              },
              {
                content: (elementItem.IsBandBackToFirst) ? 'Yes' : 'No'
              },
              {
                content: element.PerUnitName
              },
              {
                content: element.ChargingIntervalName
              }]);
          }

        });

      });
      pdf.autoTable({
        theme: 'plain',
        columnStyles: {
          0: {
            cellWidth: (pdf.internal.pageSize.width / 17)
          },
          1: {
            cellWidth: (pdf.internal.pageSize.width / 10)
          },
          2: {
            cellWidth: (pdf.internal.pageSize.width / 10)
          },
          3: {
            cellWidth: (pdf.internal.pageSize.width / 20)
          },
          4: {
            cellWidth: (pdf.internal.pageSize.width / 17)
          },
          5: {
            cellWidth: (pdf.internal.pageSize.width / 17)
          }, 6: {
            cellWidth: (pdf.internal.pageSize.width / 12)
          },
          10: {
            cellWidth: (pdf.internal.pageSize.width / 21)
          },
          11: {
            cellWidth: (pdf.internal.pageSize.width / 21)
          }
        },
        margin: { left: 10, top: 10 },
        head: index === 0 ? PricingGridHeader : PricingGridHeader1,
        pageBreak: 'auto',
        showHead: 'firstPage',
        tableWidth: (pdf.internal.pageSize.width) - 20,
        body: itemlist,
        styles: this.DiscountPeriodBodyStyle,
        didDrawCell: itemlist,
        font: 'customNormal',
      });


    });

  }

  checkExistValue(item, key, type?, searchkey?) {
    if (type === 'Array') {
      return (item && item[key]) ? item[key].map(x => x[searchkey]) : 'N/A';
    } else {
      return (item && item[key]) ? item[key] : 'N/A';
    }
  }
  convertDecimalFormat(rate) {
    return formatCurrency(rate, 'en', '', 'USD', '1.2-6');
  }

  convertCurruncyFormat(rate) {
    return formatNumber(rate, 'en');
  }

  setPageNo(pdf) {
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(170);
      pdf.text(10, (pdf.internal.pageSize.height) - 5, 'Page-' + i);
      pdf.setFontSize(15);
      pdf.setTextColor(170);
      // pdf.text(((pdf.internal.pageSize.width) / 2) - 20, (pdf.internal.pageSize.height) - 5, 'Tritex Solutions Ltd');

    }
  }

  mapRegionCountry(el: any) {
    if (el.RegionCountryID && el.RegionCountryID.length > 0 && el.TerminatedTypeID !== 1) {
      this.CountryRegions.push([el.TerminatedName, el.RegionCountryID.map(n => ' ' + n.CountryName).toString()]);
    }

  }
  getDate(date) {
    // return moment(date).locale('en').utc().format('LL');
    return date ? moment(date).locale('en').utc().format('DD MMMM YYYY') : 'N/A';
  }

  getDateFormat(date) {
    return date ? moment(date, 'DD/MM/YYYY').locale('en').format('DD MMMM YYYY') : 'N/A';
  }
  getTemplate(TemplateName: any, data, IsTrade) {
    const Template = TemplateName.split('-');
    if (Template[0].trim() === 'My Template') {
      return data.TradingEntityName + ' ' + 'Template';
    } else if (Template[0].trim() === 'Counterparty Template') {
      return IsTrade ? (data.CounterParty[0].OperatorName + ' ' + 'Template') : (data.CounterPartyName + ' ' + 'Template');
    } else {
      return Template[0].trim();
    }
  }

  getDiscountPeriodHeader(multiplePeriod: boolean, isLongStub: boolean) {
    const DiscountPeriodHeader = [
      [
        {
          content: 'Discount Periods' + (multiplePeriod ? (isLongStub ? '- Long stub' : '- Short stub') : ''),
          colSpan: 3, styles: { halign: 'center', fontStyle: 'customNormal', font: 'customBold' }
        }
      ],
      [
        {
          content: 'Sr. No.', styles: this.DiscountPeriodHeadStyle
        },
        {
          content: 'Start Date', styles: this.DiscountPeriodHeadStyle
        },
        {
          content: 'End Date', styles: this.DiscountPeriodHeadStyle
        }],

    ];

    return DiscountPeriodHeader;
  }

}
