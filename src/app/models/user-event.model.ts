export class UserEventLogModel {
    Module: string;
    ReferenceNo: string;
    FunctioName: string;
    ItemsEffected: string;
    IPAddress: string;
    SubModuleID: number;
    UniqueID: string;
    Device: string;
    BrowserName: string;
    UserID: string;
}

export class ContractDetails {
    tritexCounterParty: boolean;
    taskLockDate: string;
    documentCreated: string;
    tradingParty: string;
    isTaskLocked: boolean;
    recipientTeamValue: string;
    senderTeam: string;
    initiator: boolean;
    taskLockedBy: string;
    description: string;
    dealStartDate: string;
    referenceId: string;
    documentModifier: string;
    myTeamUser: string;
    documentNode: string;
    senderFullName: string;
    initiationDate: string;
    senderUser: string;
    supDocFolder: string;
    documentModified: string;
    counterParty: string;
    documentCreator: string;
    pdfFolder: string;
    taskReadUsers: string;
    counterPartyID: string;
    documentName: string;
    dealType: string;
    myTeamUserFullName: string;
    dealTypeEnumID: string;
    tradingPartyID: string;
    counterPartyTCID: string;
    templateName: string;
    docSigned: boolean;
    contractFolder: string;
    contractId: string;
    comment: string;
    taskTitle: string;
    contractFromEnumID: string;
    senderTeamValue: string;
    taskId: string;
    startDate: string;
    tradingPartyTCID: string;
    completedRecipientTeam: string;
    completedRecipientTeamValue: string;
    completedRecipientUser: string;
    owner: string;
    completionDate: string;
    whoHasIt: string;
    modifier: string;
    signedUnsigned: string;
    docuSign: any;
    refrenceId: string;
    senderUserFullName: string;
    modified: string;
    groupAssignee: string;
    creator: string;
    created: string;
    taskStartDate: string;
    dealEndDate: string;
    workflowId: string;
    contractStatus: string;
    counterPartyName: string;
    tradingPartyName: string;
    listType: string;
    listColor: string;
    status: string;
    statusDisplay: string;
    actionDate: string;
    actionDateActual: string;
    whoHasThePen: string;
    counterPartyDispName: string;
    contractStatusKey: string;
    isUnRead: boolean;
}

export class UserEventAlfLogModel {
    prop_tue_module: string;
    prop_tue_referenceNo: string;
    prop_tue_functioName: string;
    prop_tue_itemsEffected: string;
    prop_tue_subModuleID: number;
    prop_tue_documentVersion: string;
    prop_tue_metadataVersion: number;
    prop_tue_action: string;
    prop_tue_recepient: string;
    prop_tue_recepientRole: string;
    prop_tue_comment: string;
    prop_tue_metadataId: string;
    prop_tue_controlledDocument: boolean;
    prop_tue_contractID: string;
    prop_tue_counterParty: string;
    prop_tue_tadingParty: string;
    prop_tue_isVisible: boolean;
    alf_destination: string;
    prop_tue_roles: string;
    prop_tue_isSenderCP: boolean;
    prop_tue_isReceiverCP: boolean;
    prop_tue_isDispToAll: boolean;
}

export class StatusModel {
    count: number;
    icon: string;
    class: string;
    displayLabel: string;
    key: string;
    display: boolean;
}

export class ContractStatusModel {
    all: StatusModel;
    drafted: StatusModel;
    screenSaved: StatusModel;
    withMyTeam: StatusModel;
    withCounterParty: StatusModel;
    completed: StatusModel;
    cancelled: StatusModel;
    signed: StatusModel;
    awaitingCounterPartySignature: StatusModel;
    awaitingMySignature: StatusModel;
    withInternal: StatusModel;
}

export class SaveActivityLogModel {
    Module: string;
    SubModule: string;
    Event: string;
    Device: string;
    BrowserName: string;
    UserID: string;
    Comments: string;
    CommonID: string;
}
