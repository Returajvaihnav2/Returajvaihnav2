import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as lodash from 'lodash';
import { AnalyseFastService } from './analyse-fast.service';
import { OperatorService } from '../operator/operator.service';
import { CommonService } from '../common.service';
@Injectable({
  providedIn: 'root'
})
export class AnalyseScreen2Service {
  public TotalRow: any = { 'InBound': [], 'OutBound': [] };
  public GridTotalRow: any = { 'InBound': [], 'OutBound': [] };
  constructor(public analyseFastService: AnalyseFastService, private operatorService: OperatorService, private commonService: CommonService) { }
  public GroupList: any;
  isincludeThousandsSeparator = true;
  public VarianceList = [{ 'ID': 1, 'Value': 'Budget' }, { 'ID': 2, 'Value': 'Baseline' }];
  public InBoundItems = 5;
  public OutBoundItems = 5;
  public dropdownSettingsCountry = {
    idField: 'ID',
    textField: 'Value',
    enableCheckAll: false,
    itemsShowLimit: 1
  };
  public dropdownSettingsRegions = {
    idField: 'RegionID',
    textField: 'RegionName',
    enableCheckAll: false,
    itemsShowLimit: 1
  };

  public decimalMask100Limit = createNumberMask({
    prefix: '',
    postfix: '%',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 3,
    maxValue: 100,
    minValue: 0,
    allowNegative: true
  });
  public decimalMask9Limit = createNumberMask({
    prefix: '',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 4,
    integerLimit: 9,
    includeThousandsSeparator: this.isincludeThousandsSeparator,
    thousandsSeparatorSymbol: ','
    , allowNegative: true
  });
  public decimalMaskLimit = createNumberMask({
    prefix: '',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 4,
    integerLimit: 9,
    includeThousandsSeparator: this.isincludeThousandsSeparator,
    thousandsSeparatorSymbol: ',',
    allowNegative: true
  });
  public dropdownSettings = {
    singleSelection: true,
    idField: 'ID',
    textField: 'Value',
    itemsShowLimit: 1,
    allowSearchFilter: false,
    enableCheckAll: false
  };

  bindScreen2(item?) {
    const newScreen2Form = new FormGroup({
      'iVariance': new FormControl({ value: (item && item.iVariance) ? item.iVariance : '', disabled: false }),
      'oVariance': new FormControl({ value: (item && item.oVariance) ? item.oVariance : '', disabled: false }),
      'Group': new FormControl({ value: (item && item.Group) ? item.Group : '', disabled: false }),
      'GroupID': new FormControl({ value: (item && item.GroupID) ? item.GroupID : '', disabled: false }),
      'ExclusionCountry': new FormControl({ value: (item && item.ExclusionCountry) ? item.ExclusionCountry : '', disabled: false }),
      'Regions': new FormControl({ value: (item && item.Regions) ? item.Regions : '', disabled: false }),
      'Period': new FormControl({ value: (item && item.Period) ? this.getRangeDate(item.Period) : '', disabled: false }),
      'OutBound': this.bindOutBuond((item && item.OutBound) ? item.OutBound : []),
      'InBound': this.bindInBound((item && item.InBound) ? item.InBound : []),
      'Net': this.bindNet((item && item.Net) ? item.Net : []),
    });
    this.bindGridTotal(newScreen2Form);
    return newScreen2Form;
  }
  getRangeDate(item) {
    return [new Date(item[0]), new Date(item[1])];
  }
  OutboundRow(element) {
    return new FormGroup({
      'ID': new FormControl({ value: element.ID, disabled: false }),
      'CountryID': new FormControl({ value: element.CountryID, disabled: false }),
      'CountryName': new FormControl({ value: element.CountryName, disabled: false }),
      'OperatorName': new FormControl({ value: element.OperatorName, disabled: false }),
      'OperatorID': new FormControl({ value: element.OperatorID, disabled: false }),
      'RegionName': new FormControl({ value: element.RegionName, disabled: false }),
      'RegionID': new FormControl({ value: element.RegionID, disabled: false }),
      'RegionType': new FormControl({ value: element.RegionType, disabled: false }),
      'DealType': new FormControl({ value: element.DealType, disabled: false }),
      'DealTypeID': new FormControl({ value: element.DealTypeID, disabled: false }),
      'ScenarioName': new FormControl({ value: element.ScenarioName, disabled: false }),
      'ScenarioID': new FormControl({ value: element.ScenarioID, disabled: false }),
      'TrafficeContribution': new FormControl({ value: element.TrafficeContribution, disabled: false }),
      'BaseLineCost': new FormControl({ value: element.BaseLineCost, disabled: false }),
      'BudgetCost': new FormControl({ value: element.BudgetCost, disabled: false }),
      'UpdatedTrafficSplit': new FormControl({ value: element.UpdatedTrafficSplit, disabled: false }),
      'Voice': new FormControl({ value: element.Voice, disabled: false }),
      'SMS': new FormControl({ value: element.SMS, disabled: false }),
      'Data': new FormControl({ value: element.Data, disabled: false }),
      'Commitment': new FormControl({ value: element.Commitment, disabled: false }),
      'ScenarioForcastedCost': new FormControl({ value: element.ScenarioForcastedCost, disabled: false }),
      'Variance': new FormControl({ value: element.Variance, disabled: false }),
      'VarianceTypeID': new FormControl({ value: element.VarianceTypeID, disabled: false }),
      'Type': new FormControl({ value: element.Type, disabled: false }),
      'TypeID': new FormControl({ value: element.TypeID, disabled: false }),
      'iIsExtend': new FormControl({ value: element.iIsExtend ? element.iIsExtend : false, disabled: false }),
    });
  }
  InboundRow(element) {
    return new FormGroup({
      'ID': new FormControl({ value: element.ID, disabled: false }),
      'CountryID': new FormControl({ value: element.CountryID, disabled: false }),
      'CountryName': new FormControl({ value: element.CountryName, disabled: false }),
      'OperatorName': new FormControl({ value: element.OperatorName, disabled: false }),
      'OperatorID': new FormControl({ value: element.OperatorID, disabled: false }),
      'RegionName': new FormControl({ value: element.RegionName, disabled: false }),
      'RegionID': new FormControl({ value: element.RegionID, disabled: false }),
      'RegionType': new FormControl({ value: element.RegionType, disabled: false }),
      'ScenarioName': new FormControl({ value: element.ScenarioName, disabled: false }),
      'ScenarioID': new FormControl({ value: element.ScenarioID, disabled: false }),
      'DealType': new FormControl({ value: element.DealType, disabled: false }),
      'DealTypeID': new FormControl({ value: element.DealTypeID, disabled: false }),
      'BaseLineRevenue': new FormControl({ value: element.BaseLineRevenue, disabled: false }),
      'BudgetRevenue': new FormControl({ value: element.BudgetRevenue, disabled: false }),
      'ScaleOfLastYearTraffic': new FormControl({ value: element.ScaleOfLastYearTraffic, disabled: false }),
      'Voice': new FormControl({ value: element.Voice, disabled: false }),
      'SMS': new FormControl({ value: element.SMS, disabled: false }),
      'Data': new FormControl({ value: element.Data, disabled: false }),
      'Commitment': new FormControl({ value: element.Commitment, disabled: false }),
      'ScenarioForecastedRevenue': new FormControl({ value: element.ScenarioForecastedRevenue, disabled: false }),
      'Variance': new FormControl({ value: element.Variance, disabled: false }),
      'VarianceTypeID': new FormControl({ value: element.VarianceTypeID, disabled: false }),
      'Type': new FormControl({ value: element.Type, disabled: false }),
      'TypeID': new FormControl({ value: element.TypeID, disabled: false }),
      'iIsExtend': new FormControl({ value: element.iIsExtend ? element.iIsExtend : false, disabled: false }),
    })
  }
  bindOutBuond(items?): FormArray {
    if (items) {
      const outBoundArray = new FormArray([]);
      items.forEach(element => {
        outBoundArray.push(this.OutboundRow(element));
      });
      return outBoundArray;
    } else {
      return new FormArray([]);
    }
  }
  bindInBound(items?): FormArray {
    if (items) {
      const inBoundArray = new FormArray([]);
      items.forEach(element => {
        inBoundArray.push(this.InboundRow(element));
      });
      return inBoundArray;
    } else {
      return new FormArray([]);
    }

  }
  bindNet(items?): FormArray {
    if (items) {
      const rowArray = new FormArray([]);
      items.forEach(element => {
        rowArray.push(this.NetRow(element));
      });
      return rowArray;
    } else {
      return new FormArray([]);
    }
  }

  NetRow(element) {
    return new FormGroup({
      'ID': new FormControl({ value: element.ID, disabled: false }),
      'GroupID': new FormControl({ value: element.GroupID, disabled: false }),
      'GroupName': new FormControl({ value: element.GroupName, disabled: false }),
      'CountryID': new FormControl({ value: element.CountryID, disabled: false }),
      'CountryName': new FormControl({ value: element.CountryName, disabled: false }),
      'Scenarioforecastednetposition': new FormControl({ value: element.Scenarioforecastednetposition, disabled: false }),
      'Variance': new FormControl({ value: element.Variance, disabled: false }),
      'VariancePer': new FormControl({ value: element.VariancePer, disabled: false })
    });
  }

  getArray(control, form): FormArray {
    return form.get(control) as FormArray;
  }

  Screen2DataModel(AnalseModel?): Promise<any> {
    return new Promise((resolve, reject) => {
      const outBound = [];
      const inBound = [];
      AnalseModel.TadigCode.forEach(element => {
        outBound.push({
          'ID': element.RowNo,
          'DealTypeID': 1,
          'CountryID': element.CountryTAPCodeId,
          'CountryName': element.CountryName1,
          'OperatorName': element.OperatorName,
          'OperatorID': element.OperatorId,
          'RegionName': element.RegionName,
          'RegionID': element.RegionId,
          'RegionType': element.RegionType,
          'DealType': 'Bal / Unbal',
          'Type': 'Parent',
          'TypeID': 1,
          'ScenarioID': 1,
          'ScenarioName': 'New RFQ',
          'TrafficeContribution': 75,
          'BaseLineCost': 20497086,
          'BudgetCost': 34161810,
          'UpdatedTrafficSplit': 40,
          'Voice': '0.4902',
          'SMS': '0.0833',
          'Data': '0.0585',
          'Commitment': 6000000,
          'ScenarioForcastedCost': 20477784,
          'VarianceTypeID': 1,
          'Variance': -13684026,

        });
        inBound.push({
          'ID': element.RowNo
          , 'DealTypeID': 1
          , 'CountryID': element.CountryTAPCodeId
          , 'CountryName': element.CountryName1
          , 'OperatorName': element.OperatorName
          , 'OperatorID': element.OperatorId
          , 'RegionName': element.RegionName
          , 'RegionID': element.RegionId
          , 'RegionType': element.RegionType
          , 'ScenarioName': 'New RFQ'
          , 'ScenarioID': 1
          , 'DealType': 'Bal / Unbal'
          , 'Type': 'Parrent'
          , 'TypeID': 1
          , 'BaseLineRevenue': 3718733
          , 'BudgetRevenue': 4648416
          , 'ScaleOfLastYearTraffic': 20
          , 'Voice': '0.4800'
          , 'SMS': '0.0470'
          , 'Data': '0.0590'
          , 'Commitment': 4000000
          , 'ScenarioForecastedRevenue': 6018519
          , 'VarianceTypeID': 1
          , 'Variance': 1370103

        });
      });
      const net = [
        {
          'ID': 1,
          'GroupID': AnalseModel.GroupID,
          'GroupName': AnalseModel.Group,
          'CountryID': 1,
          'CountryName': 'Brazil',
          'Scenarioforecastednetposition': 100000,
          'Variance': 2000,
          'VariancePer': 6
        }];
      const Data = {
        'iVariance': [
          { 'ID': 1, 'Value': 'Budget' }
        ],
        'oVariance': [
          { 'ID': 1, 'Value': 'Budget' }
        ],
        'Group': AnalseModel.Group,
        'GroupID': AnalseModel.GroupID,
        'ExclusionCountry': AnalseModel.ExclusionCountry ? AnalseModel.ExclusionCountry : [{ 'ID': 0, 'Value': 'None' }],
        'Regions': AnalseModel.Regions ? AnalseModel.Regions : [{ 'RegionID': 1, 'RegionName': 'All' }],

        'Period': [new Date('01/01/2021'), new Date('12/31/2021')],
        'OutBound': outBound,
        'InBound': inBound,
        'Net': net
      };
      return resolve(Data);
    });
  }

  getGroupList(type, userID) {
    this.operatorService
      .getCounterParty(type, userID)
      .then(res => {
        this.GroupList = res.result;
      });
  }

  bindVarianceType(newScreen2Form, ControlName, ArrayControlName, Value, UpdateControl = false) {
    if (UpdateControl) {
      newScreen2Form.get(ControlName).patchValue([{ 'ID': 1, 'Value': 'Budget' }]);
    }
    const ArrayControls = this.getArray(ArrayControlName, newScreen2Form);
    ArrayControls.controls.forEach(x => {
      x.get('VarianceTypeID').patchValue(Value);
    });
  }

  addTotalRowData(CountryID, Type, newScreen2Form) {
    const formArrayValue = newScreen2Form.get(Type).value;
    const i = formArrayValue.filter(x => x.TypeID === 1).map(el => el.CountryID).indexOf(CountryID);
    this.TotalRow[Type][i] = [];
    let TotalRow = 0;
    const data = formArrayValue.filter(x => Number(x.CountryID) === Number(CountryID));
    if (data && data.length > 1) {
      data.filter(x => Number(x.CountryID) === Number(CountryID)).forEach((Row, index) => {
        TotalRow = index + 1;
        this.TotalRow[Type][i].Voice = this.checkisNan(this.TotalRow[Type][i].Voice) + this.checkisNan(Row.Voice);
        this.TotalRow[Type][i].SMS = this.checkisNan(this.TotalRow[Type][i].SMS) + this.checkisNan(Row.SMS);
        this.TotalRow[Type][i].Data = this.checkisNan(this.TotalRow[Type][i].Data) + this.checkisNan(Row.Data);
        this.TotalRow[Type][i].Commitment = this.checkisNan(this.TotalRow[Type][i].Commitment) + this.checkisNan(Row.Commitment);
        this.TotalRow[Type][i].Variance = this.checkisNan(this.TotalRow[Type][i].Variance) + this.checkisNan(Row.Variance);
        if (Type === 'InBound') {
          this.TotalRow[Type][i].BaseLineRevenue = this.checkisNan(this.TotalRow[Type][i].BaseLineRevenue) + this.checkisNan(Row.BaseLineRevenue);
          this.TotalRow[Type][i].BudgetRevenue = this.checkisNan(this.TotalRow[Type][i].BudgetRevenue) + this.checkisNan(Row.BudgetRevenue);
          this.TotalRow[Type][i].ScaleOfLastYearTraffic = this.checkisNan(this.TotalRow[Type][i].ScaleOfLastYearTraffic) + this.checkisNan(Row.ScaleOfLastYearTraffic);
          this.TotalRow[Type][i].ScenarioForecastedRevenue = this.checkisNan(this.TotalRow[Type][i].ScenarioForecastedRevenue) + this.checkisNan(Row.ScenarioForecastedRevenue);

        } else {
          this.TotalRow[Type][i].TrafficeContribution = this.checkisNan(this.TotalRow[Type][i].TrafficeContribution) + this.checkisNan(Row.TrafficeContribution);
          this.TotalRow[Type][i].BaseLineCost = this.checkisNan(this.TotalRow[Type][i].BaseLineCost) + this.checkisNan(Row.BaseLineCost);
          this.TotalRow[Type][i].BudgetCost = this.checkisNan(this.TotalRow[Type][i].BudgetCost) + this.checkisNan(Row.BudgetCost);
          this.TotalRow[Type][i].UpdatedTrafficSplit = this.checkisNan(this.TotalRow[Type][i].UpdatedTrafficSplit) + this.checkisNan(Row.UpdatedTrafficSplit);
          this.TotalRow[Type][i].ScenarioForcastedCost = this.checkisNan(this.TotalRow[Type][i].ScenarioForcastedCost) + this.checkisNan(Row.ScenarioForcastedCost);
        }

      });
      //TotalRow
      this.TotalRow[Type][i].Voice = this.TotalRow[Type][i].Voice / TotalRow;
      this.TotalRow[Type][i].SMS = this.TotalRow[Type][i].SMS / TotalRow;
      this.TotalRow[Type][i].Data = this.TotalRow[Type][i].Data / TotalRow;
      if (Type === 'InBound') {
        this.TotalRow[Type][i].ScaleOfLastYearTraffic = this.TotalRow[Type][i].ScaleOfLastYearTraffic / TotalRow;
      } else {
        this.TotalRow[Type][i].TrafficeContribution = this.TotalRow[Type][i].TrafficeContribution / TotalRow;
        this.TotalRow[Type][i].UpdatedTrafficSplit = this.TotalRow[Type][i].UpdatedTrafficSplit / TotalRow;
      }
    }
    this.addGridTotalRow(Type, newScreen2Form);
    return this.TotalRow;
  }

  removeItems(formArray, formcontrolCountryID, TypeID, Type) {
    const items: any = formArray.value.filter(x => x.CountryID == formcontrolCountryID && x.TypeID == TypeID);
    if (items && items.length > 0) {
      formArray.controls.forEach((element, j) => {
        if (element.get('CountryID').value == formcontrolCountryID && element.get('TypeID').value == TypeID) {
          formArray.removeAt(j);
        }
      });
      this.removeItems(formArray, formcontrolCountryID, TypeID, Type);
    }

  }

  removeTotalRowData(Type, i, newScreen2Form) {
    this.addGridTotalRow(Type, newScreen2Form);
    this.TotalRow[Type][i] = [];
  }

  addGridTotalRow(Type, newScreen2Form) {
    const formArrayValue = newScreen2Form.get(Type).value;
    let GridTotalRowCount = 0;
    this.GridTotalRow[Type] = {};
    if (formArrayValue && formArrayValue.length > 0) {
      formArrayValue.forEach((Row, index) => {
        GridTotalRowCount = index + 1;
        this.GridTotalRow[Type].Voice = this.checkisNan(this.GridTotalRow[Type].Voice) + this.checkisNan(Row.Voice);
        this.GridTotalRow[Type].SMS = this.checkisNan(this.GridTotalRow[Type].SMS) + this.checkisNan(Row.SMS);
        this.GridTotalRow[Type].Data = this.checkisNan(this.GridTotalRow[Type].Data) + this.checkisNan(Row.Data);
        this.GridTotalRow[Type].Commitment = this.checkisNan(this.GridTotalRow[Type].Commitment) + this.checkisNan(Row.Commitment);
        this.GridTotalRow[Type].Variance = this.checkisNan(this.GridTotalRow[Type].Variance) + this.checkisNan(Row.Variance);
        if (Type === 'InBound') {
          this.GridTotalRow[Type].BaseLineRevenue = this.checkisNan(this.GridTotalRow[Type].BaseLineRevenue) + this.checkisNan(Row.BaseLineRevenue);
          this.GridTotalRow[Type].BudgetRevenue = this.checkisNan(this.GridTotalRow[Type].BudgetRevenue) + this.checkisNan(Row.BudgetRevenue);
          this.GridTotalRow[Type].ScaleOfLastYearTraffic = this.checkisNan(this.GridTotalRow[Type].ScaleOfLastYearTraffic) + this.checkisNan(Row.ScaleOfLastYearTraffic);
          this.GridTotalRow[Type].ScenarioForecastedRevenue = this.checkisNan(this.GridTotalRow[Type].ScenarioForecastedRevenue) + this.checkisNan(Row.ScenarioForecastedRevenue);

        } else {
          this.GridTotalRow[Type].TrafficeContribution = this.checkisNan(this.GridTotalRow[Type].TrafficeContribution) + this.checkisNan(Row.TrafficeContribution);
          this.GridTotalRow[Type].BaseLineCost = this.checkisNan(this.GridTotalRow[Type].BaseLineCost) + this.checkisNan(Row.BaseLineCost);
          this.GridTotalRow[Type].BudgetCost = this.checkisNan(this.GridTotalRow[Type].BudgetCost) + this.checkisNan(Row.BudgetCost);
          this.GridTotalRow[Type].UpdatedTrafficSplit = this.checkisNan(this.GridTotalRow[Type].UpdatedTrafficSplit) + this.checkisNan(Row.UpdatedTrafficSplit);
          this.GridTotalRow[Type].ScenarioForcastedCost = this.checkisNan(this.GridTotalRow[Type].ScenarioForcastedCost) + this.checkisNan(Row.ScenarioForcastedCost);
        }

      });
      //GridTotalRow
      this.GridTotalRow[Type].Voice = this.GridTotalRow[Type].Voice / GridTotalRowCount;
      this.GridTotalRow[Type].SMS = this.GridTotalRow[Type].SMS / GridTotalRowCount;
      this.GridTotalRow[Type].Data = this.GridTotalRow[Type].Data / GridTotalRowCount;
      if (Type === 'InBound') {
        this.GridTotalRow[Type].ScaleOfLastYearTraffic = this.GridTotalRow[Type].ScaleOfLastYearTraffic / GridTotalRowCount;
      } else {
        this.GridTotalRow[Type].TrafficeContribution = this.GridTotalRow[Type].TrafficeContribution / GridTotalRowCount;
        this.GridTotalRow[Type].UpdatedTrafficSplit = this.GridTotalRow[Type].UpdatedTrafficSplit / GridTotalRowCount;
      }


    }
  }



  getTotalRow(i, CountryID, Type, newScreen2Form, Limit) {
    const formArrayValue = newScreen2Form.get(Type).value;
    let TotalChild = this.getTotalChild(formArrayValue, Limit);
    const Type2Length = formArrayValue.filter(x => x.CountryID == CountryID && x.TypeID == 2).length
    if (Type2Length > 0) {
      const lastindex = formArrayValue.map(el => el.CountryID).lastIndexOf(CountryID);
      const firstindex = formArrayValue.map(el => el.CountryID).indexOf(CountryID);
      return (!Limit) ? (i === lastindex) : (i === lastindex) && ((Limit + TotalChild >= firstindex) && i <= (lastindex + firstindex + TotalChild));
    }
    return false;
  }

  getChildRow(Type, row, limititem, i, newScreen2Form) {
    const formArrayValue = newScreen2Form.get(Type).value;
    let TotalChild = this.getTotalChild(formArrayValue, limititem);
    const lastindex = formArrayValue.map(el => el.CountryID).lastIndexOf(row.get('CountryID').value);
    const firstindex = formArrayValue.map(el => el.CountryID).indexOf(row.get('CountryID').value);
    return ((limititem + TotalChild) >= firstindex) && i <= (lastindex + firstindex + TotalChild);
  }

  getTotalChild(formArrayValue, limititem): number {
    let TotalChild = 0;
    formArrayValue.filter(x => x.TypeID === 1).slice(0, limititem).forEach(element => {
      const Length = formArrayValue.filter(x => x.CountryID === element.CountryID).length;
      TotalChild = TotalChild + (Length > 1 ? Length - 1 : 0);
    });
    return TotalChild;
  }


  bindGridTotal(newScreen2Form) {
    this.addGridTotalRow('InBound', newScreen2Form);
    this.addGridTotalRow('OutBound', newScreen2Form);
  }

  checkisNan(number) {
    if (typeof number === 'string') {
      return number ? Number(number.replace(/,/g, '')) : 0;
    }
    return isNaN(Number(number)) ? 0 : Number(number);
  }

  getRegions(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.commonService.getRegions(userId, 'RegionWithInactive').then(res => {
        resolve(res.result.filter(x => x.IsDefault === true));
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

