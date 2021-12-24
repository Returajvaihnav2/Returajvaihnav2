
import { Injectable, NgZone } from '@angular/core';
import * as moment from 'moment';
import { ContentService, AuthenticationService, AppConfigService, NodesApiService } from '@alfresco/adf-core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from '../partialviews/confirmation/confirmation-modal.component';
import { Router } from '@angular/router';
import { BrowserStorageService } from './browser-storage.service';
import { Constants } from '../constants/app.constants';
import { SpinnerService } from '../services/spinner.service';
import { ContractService } from '../services/contract/contract.service';
import { MyTaskServiceService } from '../services/my-task-service.service';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { UserService } from '../services/user/user.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { XmlContractService } from '../services/export-file/xml-contract.service';
import { DealFastXMLService } from '../services/export-file/dealfast_xml.service';
import * as FileSaver from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as lodash from 'lodash';
import { ApiService } from '../services/api.service';
import { NodeJsService } from '../services/nodejs/nodejs.service';
@Injectable()
export class UtilityProvider {

    public modalReference: BsModalRef;
    public modalConfig: any = {
        class: 'modal-lg',
        backdrop: 'static'
    };
    public NumericOnly = { 'A': { pattern: new RegExp('\[0-9\]') } };
    public Percentage = { 'A': { pattern: new RegExp('^(100\.00|100\.0|100)|([0-9]{1,2}){0,1}(\.[0-9]{1,2}){0,1}$') } };
    //public Percentage = { 'A': { pattern: new RegExp('^\(\?\:\d\{1,2\}\(\?\:\.\d\{1,2\}\)\?\|100\(\?\:\.0\?0\)\?\)\$') } };
    public AlphabateOnly = { 'A': { pattern: new RegExp('\[a-zA-Z\]') } };
    public AlphaNumric = { 'A': { pattern: new RegExp('\[a-zA-Z0-9\]') } };
    //public NotAllowChar = { 'A': { pattern: new RegExp('^[^~]+$') } };
    // public NotAllowChar = { 'A': { pattern: new RegExp('^[-_@a-zA-Z0-9 ]+$') } };
    public NotAllowChar = { 'A': { pattern: new RegExp('^[-_&@a-zA-Z0-9 ]+$') } };
    public MobileNo = { 'A': { pattern: new RegExp('^[+0-9]+$') } };
    public AlphaNumricDash = { 'A': { pattern: new RegExp('\[a-zA-Z0-9-\]') } };
    public AlphaNumricUnderScore = { 'A': { pattern: new RegExp('\[a-zA-Z0-9_\]') } };
    public AlphaNumricDot = { 'A': { pattern: new RegExp('\[a-zA-Z0-9.\]') } };
    constructor(private contentService: ContentService,
        public modalService: BsModalService,
        private browserStorageService: BrowserStorageService,
        private spinner: SpinnerService,
        private router: Router,
        private contractService: ContractService,
        private alfAuthuthService: AuthenticationService,
        private xmlContractService: XmlContractService,
        private dealFastXMLService: DealFastXMLService,
        private userService: UserService,
        private myTaskSerice: MyTaskServiceService,
        private appConfigService: AppConfigService,
        private apiService: AlfrescoApiService,
        private httpApiService: ApiService,
        private http: HttpClient,
        private nodeServiceApi: NodesApiService,
        private nodeJsService: NodeJsService,
        private zone: NgZone) { }

    convertToFormatedDateWithTime(dateVar: any, patern?: string) {
        if (dateVar == null || dateVar === '') {
            return '';
        }
        return moment(dateVar).format(patern ? patern : 'DD-MM-YYYY HH:mm:ss');
    }

    setStatusMenu(Constant, docusignStatus) {
        Object.keys(Constant.SIGN_STATUS).forEach((method) => {
            Object.keys(Constant.SIGN_STATUS[method].STATUS).forEach((status: any) => {
                docusignStatus.push({
                    dispName: Constant.SIGN_STATUS[method].STATUS[status].dispName + '(' + Constant.SIGN_STATUS[method].DISP_NAME + ')',
                    method: Constant.SIGN_STATUS[method].METHOD,
                    status: Constant.SIGN_STATUS[method].STATUS[status].status
                });
            });
        });
    }

    getStatusMenu(Constant, docusignStatusMenu) {
        Object.keys(Constant.SIGN_STATUS).forEach((method) => {
            Object.keys(Constant.SIGN_STATUS[method].STATUS).forEach((status: any) => {
                docusignStatusMenu.push({
                    dispName: Constant.SIGN_STATUS[method].NAME,
                    method: Constant.SIGN_STATUS[method].METHOD,
                    methodStatus: Constant.SIGN_STATUS[method].STATUS[status].status,
                    methodStatusName: Constant.SIGN_STATUS[method].STATUS[status].NAME
                });
            });
        });
    }


    convertToFormatedDate(dateVar: any) {
        if (dateVar == null || dateVar === '') {
            return '';
        }
        return moment(dateVar).format('DD-MM-YYYY');
    }

    convertToFormatedDateWithoutYear(dateVar: any) {
        if (dateVar == null || dateVar === '') {
            return '';
        }
        return moment(dateVar).format('MM/DD/YYYY');
    }

    newConvertToFormatedDate(dateVar: any) {
        if (dateVar == null || dateVar === '') {
            return '';
        }
        return moment(dateVar, 'DD/MM/YYYY').format('DD-MM-YYYY');
    }

    convertToFormattedDate(dateVar: any) {
        if (dateVar == null || dateVar === '') {
            return '';
        }
        return moment(dateVar).format('DD/MM/YYYY');
    }
    convertToFormattedDateTime(dateVar: any) {
        if (dateVar == null || dateVar === '') {
            return '';
        }
        return moment(dateVar).format('DD/MM/YYYY HH:mm:ss');
    }

    downloadDocument(docNode: any, openInNewTab?: boolean) {
        let url = this.contentService.getContentUrl(docNode);
        url = url.replace('/workspace://SpacesStore', '');
        if (openInNewTab) {
            window.open(url);
        } else {
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            const att = document.createAttribute("download");
            link.setAttributeNode(att);
            // window.open(url);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    }

    downloadContent(docNode: any, docName: string) {


        const ecmHost = this.appConfigService.get<string>('ecmHost');
        const ticket = this.apiService.getInstance().getTicketEcm();
        const roleTicket = `ROLE_TICKET:${ticket}`;

        const header: Object = {
            headers: new HttpHeaders().set('Authorization', `Basic ${btoa(roleTicket)}`),
            responseType: 'blob'
        };

        this.http.get(
            ecmHost +
            '/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + docNode +
            '/content?attachment=true', header
        ).subscribe((data) => {
            FileSaver.saveAs(data, docName);
        });
    }

    downloadDocumentVersion(docNode: any, versionId: any) {
        let url = this.contentService.getContentUrl(docNode, true);
        url = url.replace('/content', '/versions/' + versionId + '/content');
        url = url.replace('workspace://SpacesStore/', '');
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    openComponentModal(component: any, data?: ModalOptions) {
        if (!data) {
            data = {
                backdrop: 'static',
                keyboard: false,
                class: ''
            };
        }
        this.modalReference = this.modalService.show(component, data);
        return this.modalReference;
    }

    checkMimeTypeAndOpenUrl(nodeObj, preUrl, postUrl) {
        const docTypes = [
            { fileType: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
            { fileType: '.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }];

        let customViewerNeeded = true;
        if (nodeObj.content) {
            docTypes.forEach(element => {
                if (nodeObj.content && nodeObj.content.mimeType === element.mimeType) {
                    customViewerNeeded = false;
                }
            });

            let urlM = preUrl + nodeObj.id + postUrl;
            if (customViewerNeeded) {
                urlM += '?viewer=custom';
            }

            window.open(urlM);
        } else {
            this.displaySwalPopup('Contract Document', 'Contract Document is not uploaded yet', 'info');
        }

    }

    closeModalComponent() {
        this.modalReference.hide();
    }

    confirmationAlert(title, message, buttons?: any) {
        const modalReference = this.modalService.show(ConfirmationModalComponent, {
            backdrop: 'static',
            keyboard: false,
            class: ''
        });
        modalReference.content.modalData.title = title;
        modalReference.content.modalData.message = message;
        if (buttons) {
            modalReference.content.modalData.cancelTitle = buttons.no;
            modalReference.content.modalData.isRemoveXButton = buttons.isRemoveX ? true : false;
            modalReference.content.modalData.submitTitle = buttons.yes;
            modalReference.content.modalData.closeTitle = buttons.close;
        }
        return modalReference;
    }
    checkMax(event: any, maxValue: number) {
        const regex = new RegExp(',', 'g');
        const tempVal = event.target.value.replace(regex, '') + event.key;
        if (Number(tempVal) > maxValue) {
            event.preventDefault();
        }
    }

    changeOrder(data) {
        data.forEach(element => {
            this.setCase(element);
            element.to.forEach(to => {
                this.setCase(to);
            });
        });
    }

    setCase(element) {
        switch (element.index) {
            case 0:
                element.index = 7;
                break;
            case 1:
                element.index = 6;
                break;
            case 2:
                element.index = 5;
                break;
            case 3:
                element.index = 4;
                break;
            case 4:
                element.index = 3;
                break;
            case 5:
                element.index = 2;
                break;
            case 6:
                element.index = 1;
                break;
            case 7:
                element.index = 0;
                break;

        }
    }

    navToPrePage() {
        let preUrl = this.browserStorageService.getSessionStorageItem('preUrl');
        if (!preUrl) {
            preUrl = '';
        }
        this.router.navigate([preUrl]);
    }

    setSignatureStatusLabel(activeWorkflows: any[]) {
        if (activeWorkflows && activeWorkflows.length) {
            activeWorkflows.forEach(element => {
                if (element.docuSign) {
                    let statusDisplay = '';
                    let statusMain = '';
                    Object.keys(Constants.SIGN_STATUS).forEach((method) => {
                        Object.keys(Constants.SIGN_STATUS[method].STATUS).forEach((status: any) => {
                            if (Constants.SIGN_STATUS[method].METHOD === element.docuSign.typeOfSignature) {
                                if (Constants.SIGN_STATUS[method].STATUS[status].status.toLowerCase()
                                    === element.docuSign.status.toLowerCase()) {
                                    statusMain = Constants.SIGN_STATUS[method].STATUS[status].dispName +
                                        '(' + Constants.SIGN_STATUS[method].DISP_NAME + ')';

                                    const signtype = element.docuSign.typeOfSignature === 'docusign'
                                        || element.docuSign.typeOfSignature === 'wetinkviadocusign';

                                    if (signtype && element.docuSign.status.toLowerCase() === 'draft') {
                                        statusDisplay = 'Awaiting c\'pt sign';
                                    } else if (signtype && element.docuSign.status.toLowerCase() === 'ready') {
                                        statusDisplay = 'C\'pt sign confirmed';
                                    } else {
                                        statusDisplay = Constants.SIGN_STATUS[method].STATUS[status].dispName;
                                    }

                                    element['statusDisplay'] = statusDisplay;
                                }
                            }
                        });
                    });
                }
            });
        }
    }

    removeHighLightedText(referenceId: string, nodeObject) {
        return new Promise((resolve, reject) => {
            const dest = 'destination';
            const ext = this.getExtention(nodeObject);
            const params = 'referenceNo=' + referenceId + '&fileId='
                + nodeObject.id + '&alfToken=' + this.alfAuthuthService.getTicketEcm() + '&isFirstDraft=true&isCreatePDF=' + false + '&destination=' + dest + '&extension=' + ext;
            this.contractService.removeHilightedText(params).then((res: any) => {
                return resolve(res);
            }).catch(err => {
                return reject(err);
            });
        });
    }

    closeSpinnerRedirect() {
        // setTimeout(() => {
        this.router.navigate(['deal-fast/contracts']);
        // }, 20000);
    }

    addFirstDraftProps(nodeObject: MinimalNodeEntryEntity, status: string) {
        const data = {
            isFirstDraftCreated: status === Constants.FIRST_DRAFT.CREATED,
            firstDraftVersionStatus: status,
            firstDraftVersionId: nodeObject.properties['cm:versionLabel'],
            nodeRef: nodeObject.id
        };
        return new Promise((resolve, reject) => {
            this.myTaskSerice.addPropsToNode(data, nodeObject.id).then((res: any) => {
                return resolve(res);
            }).catch(err => {
                return reject(err);
            });
        });
    }

    downloadPDF(referenceId, nodeObject, contractId, subModule) {

        const nodeId = nodeObject.id;
        const name = nodeObject.name;
        const ext = name.substring(name.lastIndexOf('.') + 1);
        this.contractService.downloadPDF(referenceId,
            nodeId.replace('workspace://SpacesStore/', ''), ext).then((res: any) => {

                const blob = new Blob([res], { type: 'application/pdf' });

                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = referenceId + '.pdf';
                // start download
                a.click();

                if (res['status'] === 417 || res['status'] === 400) {
                    this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
                        subModule, 'PDF ' + Constants.USER_ACTIVITIES.DOCUMENT.DOWNLOAD,
                        Constants.ERROR + '-' + referenceId, contractId);
                } else {
                    this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
                        subModule, 'PDF ' + Constants.USER_ACTIVITIES.DOCUMENT.DOWNLOAD,
                        referenceId, contractId);
                }
            });
    }

    downloadXMLDocument(ContractID: string, subModule: string) {
        if (ContractID) {
            this.contractService.GetContractDetail(ContractID, 'Active', 0,
                this.browserStorageService.getLocalStorageItem('userId')).then((res: any) => {
                    if (res['status'] === 200) {
                        this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
                            subModule, Constants.USER_ACTIVITIES.CONTRACT.XML,
                            Constants.NO_COMMENTS, ContractID);
                        this.dealFastXMLService.generateXml(res['result'].Current);
                    } else {
                        this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
                            subModule, Constants.USER_ACTIVITIES.CONTRACT.XML, Constants.ERROR, ContractID);
                        this.displaySwalPopup('Error', res.message, 'error');
                    }
                });
        }
    }

    humanFileSize(bytes, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
        return bytes.toFixed(dp) + ' ' + units[u];
    }

    chatDate(dateVar?: any, format?: any) {
        if (!dateVar) {
            dateVar = new Date();
        }
        if (format) {
            return moment(dateVar, format).format('YYYY-MM-DD');
        }
        return moment(dateVar).format('YYYY-MM-DD');
    }

    getDocAndPDF(mimeType) {
        const word = [...Constants.WORDDOCEXT];
        // const pdf = [...Constants.PDFEXT];
        // const types = word.concat(pdf);

        if (word.includes(mimeType)) {
            return true;
        } else {
            return false;
        }
    }

    displaySwalPopup(title: string, text: string, type: any, item = null, showConfirmButton = false,
        confirmButtonText = null, showCancelButton = false, cancelButtonText = null, html = null, inputValue = null) {
        let modalJson: SweetAlertOptions = {
            title: title,
            text: text,
            icon: type ? type : 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,

            backdrop: false,
            onAfterClose: () => {
                if (item && item.length > 0) {
                    if (item && item.length > 1) {
                        this.setCustomFocus(item[1]);
                    } else {
                        this.setCustomFocus(item[0]);
                    }
                } else {
                    window.scrollTo(0, 0)
                }
            }
        };
        if (inputValue) {
            modalJson = {
                title: title,
                text: text,
                icon: type ? type : 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                input: inputValue,
                inputPlaceholder: "Use same currency",
                onAfterClose: () => {
                    if (item && item.length > 0) {
                        if (item && item.length > 1) {
                            this.setCustomFocus(item[1]);
                        } else {
                            this.setCustomFocus(item[0]);
                        }
                    }
                }
            }
        }
        if (html) {
            modalJson = {
                title: title,
                html: html,
                icon: type ? type : 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                heightAuto: false,
                onAfterClose: () => {
                    if (item && item.length > 0) {
                        if (item && item.length > 1) {
                            this.setCustomFocus(item[1]);
                        } else {
                            this.setCustomFocus(item[0]);
                        }
                    }
                }
            }
        }
        if (showConfirmButton) {
            modalJson['showConfirmButton'] = showConfirmButton;
            modalJson['confirmButtonText'] = confirmButtonText ? confirmButtonText : 'Ok';
            modalJson['confirmButtonColor'] = '#01527e';
            // modalJson['confirmButtonColor'] = '#DD6B55';
        }

        if (showCancelButton) {
            modalJson['showCancelButton'] = showCancelButton;
            modalJson['cancelButtonText'] = cancelButtonText ? cancelButtonText : 'Cancel';
            // modalJson['cancelButtonColor'] = '#3085d6';
            modalJson['cancelButtonColor'] = "#d3d3d3"
        }
        // return   Swal.fire(`modalJson: ${modalJson}`)
        return Swal.fire(modalJson);
    }

    setCustomFocus(item) {
        if (item) {
            item.scrollIntoView({ behavior: 'smooth' });
            item.focus();
            // item.classList.add('ng-invalid');
            item.classList.add('ng-touched');
            // item.classList.remove('ng-valid');
            // item.classList.remove('ng-untouched');
        }
        return item;
    }

    openInNewTabIfCtrl(navUrl, CtrlKey) {
        if (CtrlKey) {
            this.router.navigate([]).then(
                result => { window.open('#' + navUrl, '_blank'); });
        } else {
            this.router.navigate([navUrl]);
        }
    }

    copyInClipBoard(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    getsort(List?) {
        if (List) {
            return List.sort((a, b) => (a > b) ? 1 : -1);
        } else { return null; }
    }

    sortFormArray(array: any, args, type = 'asc') {
        if (array !== undefined) {
            return array.controls.sort((a: any, b: any) => {
                const aValue = a.controls[args].value;
                const bValue = b.controls[args].value;
                let condition1 = aValue > bValue;
                let condition2 = aValue < bValue;
                if (type === 'asc') {
                    condition1 = aValue < bValue;
                    condition2 = aValue > bValue;
                }
                if (condition1) {
                    return -1;
                } else if (condition2) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        return array;
    }

    getsortNew(List?) {
        if (List) {
            return lodash.sortBy(List, 'CountryID');
        } else { return null; }
    }


    toggleSpinner(isSpinner) {
        this.httpApiService.isSpinner = !isSpinner;
        this.spinner.displaySpinner(isSpinner);
    }

    navigateOutside(path) {
        this.zone.run(() => {
            this.router.navigate(path);
        });
    }

    sortByProperty(property) {
        return function (a, b) {
            if (a[property] > b[property])
                return 1;
            else if (a[property] < b[property])
                return -1;

            return 0;
        }
    }
    convertdate(date: any) {
        const dateArray = date.split('/');
        return (dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    }
    yesterday(): Date {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return yesterday;
    }
    getLastMonth(today = new Date()): Date {
        today.setMonth(today.getMonth() - 1);
        today.setDate(1);
        return today;
    }
    getLastMonthLastDay(today = new Date()): Date {
        today.setMonth(today.getMonth());
        return new Date(today.getFullYear(), today.getMonth(), 0);;
    }

    redirectoTap(taskDetail, contractID, tapId) {
        this.browserStorageService.setSessionStorageItem('tapcontractID', contractID);
        this.browserStorageService.setSessionStorageItem('taptype', this.router.url);
        this.browserStorageService.setSessionStorageItem('taptageID', taskDetail.contractFolder);
        if (tapId > 0) {
            this.browserStorageService.setSessionStorageItem('tapID', tapId);
        }
        this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
            Constants.DEAL_FAST.SUBMODULE.WORKFLOW, tapId > 0 ? Constants.USER_ACTIVITIES.CONTRACT.VIEW_TAP : Constants.USER_ACTIVITIES.CONTRACT.CREATE_TAP,
            taskDetail.referenceId, taskDetail.ContractID);
        this.router.navigate(['/tap-instruction/create-tap/tap/' + new Date().getTime()]);
    }

    getSupportingDoc(taskDetail): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!taskDetail.supDocFolder) {
                const parentNode = taskDetail.contractFolder.replace('workspace://SpacesStore/', '');
                this.apiService.nodesApi.createFolder(Constants.SUPPORTING_DOCUMENTS, '', parentNode, '')
                    .then(result => {
                        taskDetail.supDocFolder = result.entry.id;
                        return resolve(result);
                    }).catch(err => {
                        return reject(err);
                    });
            } else {
                const parentNode = taskDetail.supDocFolder.replace('workspace://SpacesStore/', '');
                this.apiService.nodesApi.getNodeChildren(parentNode)
                    .then(result => {
                        const supportingDocs = result.list.entries;
                        if (supportingDocs && supportingDocs.length) {
                            supportingDocs.forEach((doc, index) => {
                                this.getNodeObj(doc.entry.id, index).then((nodeOb: any) => {
                                    supportingDocs[nodeOb.index]['nodeObject'] = nodeOb.entry;
                                    if (index === (supportingDocs.length - 1)) {
                                        return resolve(supportingDocs);
                                    }
                                }).catch(err => {
                                    console.error(err);
                                    reject(err);
                                    // return resolve(result);
                                });
                            });
                        } else {
                            return resolve(result);
                        }
                    }).catch(err => {
                        return reject(err);
                    });
            }
        });
    }

    getNodeObj(id, index) {
        return new Promise((resolve, reject) => {
            this.nodeServiceApi.getNode(id).subscribe((entry: MinimalNodeEntryEntity) => {
                return resolve({ entry, index });
            }, (err) => {
                return reject(err);
            });
        });
    }

    pdfFolder(taskDetail): Promise<any> {
        return new Promise((resolve, reject) => {
            if (taskDetail.pdfFolder) {
                const parentNode = taskDetail.pdfFolder.replace('workspace://SpacesStore/', '');
                this.apiService.nodesApi
                    .getNodeChildren(parentNode)
                    .then(result => {
                        const pdfDocs = result.list.entries;
                        if (pdfDocs && pdfDocs.length) {
                            pdfDocs.forEach((doc, index) => {
                                this.getNodeObj(doc.entry.id, index)
                                    .then((nodeOb: any) => {
                                        pdfDocs[index]['nodeObject'] = nodeOb;
                                        if ((pdfDocs.length - 1) === index) {
                                            return resolve(pdfDocs);
                                        }
                                    }, function (err) {
                                        return reject(err);
                                    });
                            });
                        } else {
                            return resolve(true);
                        }

                    }).catch(err => {
                        return reject(err);
                    });
            } else {
                return resolve(true);
            }
        });
    }

    canRecall(contractFolderId, canCall: boolean, all = false) {
        let body: any = {
            prop_trtxcm_isActiveTaskLocked: canCall
        };

        if (all) {
            body = {
                prop_trtxcm_isActiveTaskLocked: canCall,
                prop_trtxcm_userCanRecall: all
            };
        }
        this.myTaskSerice.isDocControlled(body, contractFolderId);
    }

    scrollToBottom(document): void {
        try {
            setTimeout(() => {
                // Not used ViewChild, because element is inside ng-template so it is undefined.
                const ele = document.getElementById('scroll12');
                ele.scrollTop = ele.scrollHeight;
            }, 200);

        } catch (err) {
            console.error(err);
        }
    }

    // lockTask(detail, contractFolderId, taskId: string, lockTask: boolean, saveEvent: boolean) {
    //     return new Promise((resolve, reject) => {

    //         if (saveEvent) {
    //             this.toggleSpinner(true);
    //         }
    //         const body = { taskId, lockStatus: lockTask, forceLock: false };

    //         this.myTaskSerice.lockTask(body).then((res: any) => {
    //             this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
    //                 Constants.DEAL_FAST.SUBMODULE.WORKFLOW, lockTask ? Constants.USER_ACTIVITIES.CONTRACT.CHECKIN :
    //                 Constants.USER_ACTIVITIES.CONTRACT.CHECKOUT,
    //                 detail.referenceId, detail.contractId);
    //             if (saveEvent) {
    //                 this.toggleSpinner(false);
    //                 this.displayMessage(lockTask ? 'Contract checked out successfully.' : 'Contract checked in successfully.');
    //             }
    //             //  this.toggleSpinner(false);
    //             // this.callApi();

    //             this.canRecall(contractFolderId, lockTask);
    //             this.isTaskLock = lockTask;

    //             const ref = detail.referenceId;
    //             const data = {
    //                 userCanRecall: lockTask ? 0 : (this.isSignProcessAvailable ? 0 : 1),
    //                 metaDataVersionNo: this.metadataVersionNo,
    //                 documentVersion: this.nodeObject.properties['cm:versionLabel'],
    //                 isControlledDocument: this.isControlledDocument ? 1 : 0
    //             };
    //             this.nodeJsService.updateTask(ref, data);

    //             this.isTaskLockedBySameUser = lockTask;
    //             detail.isTaskLocked = lockTask;
    //             return resolve(true);
    //         }).catch(err => {
    //             this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
    //                 Constants.DEAL_FAST.SUBMODULE.WORKFLOW, lockTask ? Constants.USER_ACTIVITIES.CONTRACT.CHECKIN :
    //                 Constants.USER_ACTIVITIES.CONTRACT.CHECKOUT,
    //                 Constants.ERROR + '-' + detail.referenceId, detail.contractId);
    //             this.showPopup('warning', 'Please contact Admin !!!', 'Unable to perform task operation');
    //             this.toggleSpinner(false);
    //             return reject(false);
    //         });
    //     });
    // }
    getDuplicate(items, keys) {
        let duplicates = [];
        for (let i = 0; i < items.length; i++) {
            let matchkey = 0;
            for (let j = 0; j < keys.length; j++) {
                if ((i < (items.length - 1)) && items[i + 1][keys[j]].toLowerCase() === items[i][keys[j]].toLowerCase()) {
                    matchkey++;
                }
            }
            if (matchkey === keys.length) {
                duplicates.push(items[i]);
            }
        }
        return duplicates;
    }

    public showPopup(type: any, title: string, text: string) {
        if (type === 'error') {
            this.toggleSpinner(false);
        }
        this.displaySwalPopup(title, text, type);
    }

    displayMessage(message: string) {

        this.displaySwalPopup('', message, 'info').then((result: any) => {
            window.location.reload();
        });
    }


    saveContractDocControl(contractId, isContolled, fileName) {
        return new Promise((resolve, reject) => {
            const body = {
                "ContractID": contractId,
                "IsControlled": isContolled,
                "FileName": fileName
            }
            this.httpApiService.postWithHeader('Contract/SaveContractDocControl', body).subscribe((data) => {
                return resolve(data);
            });
        });
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getExtention(nodeObject) {
        const fileName = nodeObject.name;
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }
    getPreviousToolTips(DefaultData, Oldtrademodel, row: any, j, key, isred = false, k?) {
        if (isred) {
            if (DefaultData && DefaultData?.length && DefaultData.length >= j) {
                const datarow = this.getRow(DefaultData[j], row.get('OrderIndex').value);
                if (datarow) {
                    if (datarow.Bands && datarow.Bands.length >= k) {
                        if (datarow.Bands[k]) {
                            return (datarow.Bands[k][key] || datarow.Bands[k][key] == '0') ? 'Previous Value: ' + datarow.Bands[k][key] : 'no value';
                        } else {
                            return 'no value';
                        }

                    } else {
                        return (datarow[key] || datarow[key] == '0') ? 'Previous Value: ' + datarow[key] : 'no value';
                    }
                } else {
                    return '';
                }
            } else {
                return '';
            }
        } else {
            if (Oldtrademodel && Oldtrademodel?.length && Oldtrademodel.length >= j) {
                const datarow = this.getRow(Oldtrademodel[j], row.get('OrderIndex').value);
                if (datarow) {
                    if (datarow.Bands && datarow.Bands.length >= k) {
                        if (datarow.Bands[k]) {
                            return (datarow.Bands[k][key] || datarow.Bands[k][key] == '0') ? 'Previous Value: ' + datarow.Bands[k][key] : 'no value';
                        } else {
                            return 'no value';
                        }

                    } else {
                        return (datarow[key] || datarow[key] == '0') ? 'Previous Value: ' + datarow[key] : 'no value';
                    }
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }
    }
    getRow(array: any[], query: string): any {
        if (array && array.length > 0) {
            const result = array.filter(x => x.OrderIndex == query);
            if (result && result.length > 0) {
                return result[0];
            } else {
                return result;
            }
        }
    }

    stringToDate(dateString) {
        const mydateArr = dateString.split('-');
        return new Date(mydateArr[0], mydateArr[1] - 1, mydateArr[2]);
    }

    taskDetailDraft(data, ctrlKey, isevent = true) {
        if (isevent) {
            this.logEventCall(data, 'DRAFT');
        }

        let ContractUrl = '';
        if (data.StatusKey === 'Drafted') {
            // this.router.navigate(['draft-detail', data.contractFolder]);
            this.browserStorageService.setSessionStorageItem('draftnodeId', data.FolderNodeRef);
            ContractUrl = 'draft-detail';
        } else if (data.statusDisplay === 'ScreenSaved') {

            let FormType = '';
            if (data.contractFromEnumID === 'Online' && (data.dealTypeEnumID as string).toUpperCase() == 'IOT') {
                ContractUrl = '/deal-fast/new/iot-disc-agreement/' + new Date().getTime() + '/' + new Date().getDate();
                FormType = 'iot';
            } else if (data.contractFromEnumID === 'Online' && (data.dealTypeEnumID as string).toUpperCase() == 'NB-IOT') {
                ContractUrl = '/deal-fast/new/nb-iot-agreement/' + new Date().getTime() + '/' + new Date().getDate();
                FormType = 'nbiot';
            } else if (data.contractFromEnumID === 'Online' && (data.dealTypeEnumID as string).toUpperCase() == 'M-IOT') {
                ContractUrl = '/deal-fast/new/m-iot-agreement/' + new Date().getTime() + '/' + new Date().getDate();
                FormType = 'miot';
            } else if (data.contractFromEnumID === 'Offline') {
                ContractUrl = '/deal-fast/new/offline-agreement/' + new Date().getTime() + '/' + new Date().getDate();
                FormType = 'offline';
            }

            this.browserStorageService.setSessionStorageItem(FormType + 'contractId', data.contractId);
            this.browserStorageService.setSessionStorageItem(FormType + 'type', 'deal-fast/contracts');
            this.browserStorageService.setSessionStorageItem(FormType + 'tageID', '');
            this.browserStorageService.setSessionStorageItem(FormType + 'dealtype', data.type);
        }
        this.openInNewTabIfCtrl(ContractUrl, ctrlKey);
    }

    taskDetailOutbox(data, ctrlKey, isevent = true) {
        if (isevent) {
            this.logEventCall(data, 'OUTBOX');
        }
        // check if task is present in inbox then redirect to inbox-detail page else outbox-detail page
        this.browserStorageService.setSessionStorageItem('OutboxTaskId', 'activiti$' + data.TaskID);
        let navigateUrl = 'deal-fast/outbox/task-detail';
        if (data.StatusKey === 'WithMyTeam') {
            navigateUrl = '/deal-fast/inbox/' + data.TaskID;
        }
        this.openInNewTabIfCtrl(navigateUrl, ctrlKey);
    }

    taskDetailExecutedContract(data: any, ctrlKey, isevent = true) {

        if (isevent) {
            this.logEventCall(data, 'EXECUTED');

        }

        this.browserStorageService.setSessionStorageItem('ExecutedTaskId', data.WorkFlowID);
        this.openInNewTabIfCtrl('/deal-fast/executed/completed/task-detail', ctrlKey);
    }

    sendTOUnsignedOnly(data, ctrlKey) {
        this.browserStorageService.setSessionStorageItem('unsignedWorkflowId', data.workflowId);
        this.openInNewTabIfCtrl('/deal-fast/inbox/unsigned/detail', ctrlKey);
    }

    taskDetailInbox(data, taskId: string, ctrlKey, isevent = true) {


        if (isevent) {
            this.logEventCall(data, 'INBOX');

        }


        if (taskId) {
            data.TaskID = taskId;
        }
        if (!data.TaskID.includes('activiti$')) {
            data.TaskID = 'activiti$' + data.TaskID;
        }
        this.openInNewTabIfCtrl('/deal-fast/inbox/' + data.TaskID, ctrlKey);
    }

    taskDetailUnsigned(data, ctrlKey, isevent = true) {
        if (isevent) {
            this.logEventCall(data, 'UNSIGNED');

        }

        const taskId = data.TaskID
        if (taskId && data.StatusKey !== 'AwaitingCounterpartySignature' &&
            data.StatusKey !== 'WithInternal' &&
            data.StatusKey !== 'Cancelled' &&
            data.StatusKey !== 'WithCounterparty') {
            this.taskDetailInbox(data, taskId, ctrlKey);
        } else {
            this.browserStorageService.setSessionStorageItem('unsignedWorkflowId', data.WorkFlowID);
            this.openInNewTabIfCtrl('/deal-fast/inbox/unsigned/detail', ctrlKey);
        }
    }

    logEventCall(data, type) {
        this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
            null, Constants.USER_ACTIVITIES.CONTRACT.READ,
            data.ReferenceNo, data.ContractID);

    }
    getformateDate(date, format) {
        if (date instanceof moment) {
            const _date: any = date;
            date = moment(moment.utc(_date._i, format).toDate()).format(format);
        } else {
            date = moment(moment.utc(date, format).toDate()).format(format);
        }
        return date;
    }

    getShortName(Name){
        let NameArray = Name.split(" ");
        let FinalName='';
        if(NameArray && NameArray.length>1){
        NameArray.forEach(element => {
          if(element.replace(/,/g, "")){
            FinalName=FinalName+element[0].toUpperCase();
          }    
        });
      }else{
        if(NameArray && NameArray.length>0){
          FinalName=FinalName+NameArray[0].slice(0,2).toUpperCase();
        }
      }
        return FinalName.length>1?FinalName.slice(0,2):FinalName;
      }

}