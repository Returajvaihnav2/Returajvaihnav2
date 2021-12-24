export const Constants = {
    CONTRACT_STATUS: {
        APPROVE_FOLDER_NAME: 'Completed',
        REJECT_FOLDER_NAME: 'Rejected',
        INPROGRESS: 'In Progress',
        DRAFTED: 'Drafted',
        PENDING: 'Pending'
    },

    TRITEX_SITE_NAME: 'tritex',
    SUPPORTING_DOCUMENTS: 'Supporting Documents',
    ACCEPTED_FILE_TYPES_EXTENTIONS: '.jpg,.png,.jpeg,.doc,.docx,.ppt,.pptx,.xls,.xls,.txt,.zip,.pdf',
    OFFLINE_FILE_EX: '.doc,.docx,.ppt,.pdf',
    ONLINE_FILE_EX: '.doc,.docx,.ppt,.pdf',
    FILE_EX: '.doc,.docx,.ppt,.pdf',

    MODULE_CONSTANT: {
        DEAL_FAST: 'Deal-Fast',
        SUBMODULE: {
            IOT_ID: 1,
            NB_IOT_ID: 2,
            INBOX: 'Inbox',
            INBOX_DETAILS: 'Inbox/Details'
        }
    },
    SIGN_STATUS: {
        DOCUSIGN: {
            DISP_NAME: 'e-Sign in DocuSign',
            NAME: 'DocuSign',
            METHOD: 'docusign',
            STATUS: {
                DRAFT: {
                    dispName: 'Awaiting CP signatories',
                    method: 'docusign',
                    NAME: 'Draft',
                    status: 'draft'
                },
                READY: {
                    dispName: 'CP signatories confirmed',
                    method: 'docusign',
                    NAME: 'Ready',
                    status: 'ready'
                },
                SENT: {
                    dispName: 'Sent to DocuSign',
                    method: 'docusign',
                    NAME: 'Sent',
                    status: 'sent'
                },
                COMPLETED: {
                    dispName: 'Signing complete',
                    NAME: 'Completed',
                    method: 'docusign',
                    status: 'completed'
                }, INCOMPLETED: {
                    dispName: 'Signing incomplete',
                    method: 'docusign',
                    NAME: 'InCompleted',
                    status: 'incompleted'
                },
                CANCELLED: {
                    dispName: 'Signing cancelled',
                    method: 'docusign',
                    NAME: 'Cancelled',
                    status: 'cancelled'
                },
                REJECTED: {
                    dispName: 'Signing rejected',
                    method: 'docusign',
                    NAME: 'Rejected',
                    status: 'rejected'
                }
            }
        },
        WETINK_VIA_DOCUSIGN: {
            DISP_NAME: 'Wet Ink through DocuSign',
            METHOD: 'wetinkviadocusign',
            NAME: 'WetInk - DocuSign',
            STATUS: {
                DRAFT: {
                    dispName: 'Awaiting CP signatories',
                    method: 'docusign',
                    NAME: 'Draft',
                    status: 'draft'
                },
                READY: {
                    dispName: 'CP signatories confirmed',
                    method: 'docusign',
                    NAME: 'Ready',
                    status: 'ready'
                },
                SENT: {
                    dispName: 'Sent to DocuSign',
                    method: 'docusign',
                    NAME: 'Sent',
                    status: 'sent'
                },
                COMPLETED: {
                    dispName: 'Signing complete',
                    method: 'docusign',
                    NAME: 'Completed',
                    status: 'completed'
                },
                INCOMPLETED: {
                    dispName: 'Signing incomplete',
                    method: 'docusign',
                    NAME: 'InCompleted',
                    status: 'incompleted'
                },
                CANCELLED: {
                    dispName: 'Signing cancelled',
                    method: 'docusign',
                    NAME: 'Cancelled',
                    status: 'cancelled'
                },
                REJECTED: {
                    dispName: 'Signing rejected',
                    method: 'docusign',
                    NAME: 'Rejected',
                    status: 'rejected'
                }
            }
        },
        WETINK: {
            DISP_NAME: 'Wet Ink Manual',
            METHOD: 'wetink',
            NAME: 'WetInk',
            STATUS: {
                DRAFT: {
                    dispName: 'Awaiting your action',
                    method: 'wetink',
                    NAME: 'Draft',
                    status: 'draft'
                },
                READY: {
                    dispName: 'Awaiting partner action',
                    method: 'wetink',
                    NAME: 'Ready',
                    status: 'ready'
                },
                SENT: {
                    dispName: 'Sent to wetink',
                    method: 'wetink',
                    NAME: 'Sent',
                    status: 'sent'
                },
                COMPLETED: {
                    dispName: 'Signing complete',
                    method: 'wetink',
                    NAME: 'Completed',
                    status: 'completed'
                },
                INCOMPLETED: {
                    dispName: 'Signing incomplete',
                    method: 'wetink',
                    NAME: 'InCompleted',
                    status: 'incompleted'
                },
                CANCELLED: {
                    dispName: 'Signing cancelled',
                    method: 'wetink',
                    NAME: 'Cancelled',
                    status: 'cancelled'
                },
                REJECTED: {
                    dispName: 'Signing rejected',
                    method: 'docusign',
                    NAME: 'Rejected',
                    status: 'rejected'
                }
            }
        }
    },
    USER_ACTIVITIES: {
        MAILREDIRECT: {
            Visit: 'Visited'
        },
        Dashboard: {
            Visit: 'Visited'
        },
        AnlysFast: {
            Visit: 'Visited'
        },
        OPERATIONS: {
            FORGOT_PASSWORD: 'Forgot password',
            LOGIN: 'Login',
            LOGOUT: 'Logout',
            CHANGE_PASSWORD: 'Password Changed',
            MOBILE_CONFIRM: 'Mobile confirm',
            EMAIL_CONFIRM: 'Email confirm',
            VISIT: 'Visited'
        },
        DOCUMENT: {
            NAME: 'Document',
            ERROR: 'Error',
            CREATE: 'Uploaded',
            READ: 'Preview',
            UPDATE: 'New version uploaded',
            UPLOAD: 'Uploading started',
            DOWNLOAD: 'Downloaded',
            DELETE: 'Delete'
        },
        USER: {
            NAME: 'User',
            ERROR: 'Error',
            CREATE: 'Create',
            READ: 'View Details',
            PROFILE: 'My Profile',
            UPDATE: 'Update',
            SAVE: 'Save User',
            DELETE: 'Delete',
            ADD_NT_USER: 'Add non tritex user',
            RELEASE_LOCK: 'Release lock',
            LIST: 'View User List',
            READ_LOG: 'Read Log',
            EXPORT_EXCEL: 'Export to excel',
        },
        GROUP: {
            NAME: 'Group',
            ERROR: 'Error',
            CREATE: 'Create',
            READ: 'View Group',
            UPDATE: 'Update',
            SAVE: 'Save Group',
            DELETE: 'Delete',
            LIST: 'View Group List',
            TAP_LIST: 'View TAP Code List',
            EXPORT_EXCEL: 'Export to excel',
        },
        OPERATOR: {
            NAME: 'Operator',
            ERROR: 'Error',
            CREATE: 'Create',
            READ: 'View Operator',
            SAVE: 'Save Operator',
            UPDATE: 'Update',
            DELETE: 'Delete',
            LIST: 'View Operator List',
            TAP_LIST: 'View TAP Code List',
            EXPORT_EXCEL: 'Export to excel',
        },
        REGION: {
            NAME: 'Region',
            ERROR: 'Error',
            CREATE: 'Create',
            READ: 'View Region',
            UPDATE: 'Update',
            SAVE_AS: 'Save as',
            DELETE: 'Delete',
            SAVE: 'Save Region',
            LIST: 'View Region List',
            COUNTRY_LIST: 'View Region Country List',
            EXPORT_EXCEL: 'Export to excel',
        },
        Page: {
            ERROR: 'Error',
            CREATE: 'Create Page',
            READ: 'View Page',
            UPDATE: 'Update Page',
            SAVE: 'Save Page',
            DELETE: 'Delete Page',
            LIST: 'View Page List',
            EXPORT_EXCEL: 'Export to excel',
        },
        Menu: {
            ERROR: 'Error',
            CREATE: 'Create Menu',
            READ: 'View Menu',
            UPDATE: 'Update Menu',
            SAVE: 'Save Menu',
            DELETE: 'Delete Menu',
            LIST: 'View Menu List',
            EXPORT_EXCEL: 'Export to excel',
        },
        Role: {
            ERROR: 'Error',
            CREATE: 'Create Role',
            READ: 'View Role',
            SAVE: 'Save Role',
            UPDATE: 'Update Role',
            DELETE: 'Delete Role',
            LIST: 'View Role List',
            EXPORT_EXCEL: 'Export to excel',
        },
        Domain: {
            ERROR: 'Error',
            CREATE: 'Create Domain',
            READ: 'View Domain',
            SAVE: 'Save Domain',
            UPDATE: 'Update Domain',
            DELETE: 'Delete Domain',
            LIST: 'View Domain List',
            EXPORT_EXCEL: 'Export to excel',
        },
        RELEASENOTES: {
            NAME: 'Release notes',
            ERROR: 'Error',
            CREATE: 'Create',
            SAVE: 'Save',
            READ: 'View Release notes',
            UPDATE: 'Update',
            DELETE: 'Delete',
            DOWNLOAD: 'Download File',
            LIST: 'View Release List',
            EXPORT_EXCEL: 'Export to excel',
        },
        CONTRACT: {
            OPEN: 'Open Amend Tap Codes',
            NAME: 'Contract',
            ERROR: 'Error',
            CREATE: 'Create',
            READ: 'Get details',
            VISIT: 'Visited',
            PREVIEW_CONTRACT: 'Preview Contract',
            READ_CHECKED_OUT: 'Get details checked out',
            RELEASE_LOCK_FORCEFULLY: 'Release lock forcefully',
            UPDATE: 'Update',
            STARTED: 'Workflow Started',
            SENT: 'Sent',
            CHECKIN: 'Check in',
            REASSIGN: 'Re-assign',
            SEND_FOR_DOCUSIGN: 'Sent to DocuSign',
            WETINKPROCESS: 'Wet ink process',
            SAVE_SIGNATORY: 'Save Signatory',
            CANCEL_SIGNATURE: 'Cancel Signature Process',
            CHECKOUT: 'Check out',
            FIRST_DRAFT: 'First draft created',
            CONTRACT_SEND: 'Contract Send',
            CONTRACT_COMPLETED: 'Contract Completed',
            CONTRACT_TERMINATED: 'Contract Terminated',
            CONTRACT_REJECTED: 'Contract Rejected',
            DELETE: 'Delete',
            SPLIT: 'Split Saved',
            PDF: 'PDF Downloaded',
            EXCEL: 'Export Excel',
            XML: 'Export XML',
            CREATE_TAP: 'Create TAP',
            VIEW_TAP: 'View TAP',
            LIST_CONTRACT: 'List Contract',
            ARCHIVE_CONTRACT: 'Archive List Contract',
            COPY_DEAL: 'Copy Deal',
            RECALL_CONTRACT: 'Recall Contract',
            VIEW_DRAFT_DETAILS: 'View Draft Details',
            VIEW_TAGS: 'View Tags',
            DOWNLOAD_PDF: 'PDF Downloaded',
            DOCUMENT_UPLOAD: 'Document Uploaded',
            SUPPORTING_DOCUMENT_UPLOAD: 'Supporting Document Uploaded',
            NON_TRITEX_CP_DOCUMENT_SIGNED: 'Non-tritex CP Document Signed',
            CANCEL_UPLOAD: 'Cancel Upload',
            STATUS: {
                OUTBOX: 'Awaiting partner action',
                INBOX: 'Awaiting your action',
                UNSIGNED: 'Unsigned',
                CHECKEDOUT: 'Checked out',
                EXECUTED: 'Executed'
            }
        },
        TAP: {
            NAME: 'Tap',
            LIST: 'Tap Dashboard',
            VIEW: 'Tap View',
            ERROR: 'Error',
            GENERATE: 'Generate',
            CREATE: 'Create',
            READ: 'View TAP',
            UNDO: 'Undo TAP',
            UPDATE: 'Update',
            EXCEL: 'Export Excel',
            XML: 'Export XML',
            SENDTOOPCO: 'Sent to Opco',
            UPDATEBYOPCO: 'Update by Opco',
            CONFIRMBYOPCO: 'Confirm by Opco',
            SENDTOCP: 'Sent to CP',
            ACCEPT: 'Accepted',
            CONFIRMED: 'Confirmed',
            SENDTODCH: 'Send to DCH',
            EXPORT: 'Export TAP List',
            CANCEL: 'Cancel TAP',
            FXDATE: 'Change FX Date'
        },
        TRADE: {
            NAME: 'TradeFast',
            READ: 'View TradeFast',
            SAVE: 'Save',
            RFQ: 'RFQ Sent',
            ERROR: 'Error',
            CREATE: 'Created',
            UPDATE: 'Update',
            SENDTOCP: 'Send to counter party',
            REJECT: 'Rejected',
            ACCEPT: 'Accepted',
            COUNTER: 'Countered',
            DELETE: 'Deleted',
            SENDFORAPPROVAL: 'Sent for Approval',
            APPROVALREJECT: 'Approval Rejected',
            APPROVALACCEPT: 'Approval Accepted',
            APPROVALCANCEL: 'Approval Cancelled',
            PDF: 'PDF Downloaded',
            DRAFTREAD: 'View Draft',
            VIEWTAGS: 'View Tags',
            LIST: 'View Blotter List',
            ARCHIVE: 'View Archive List',
            EXPORT: 'Export Blotter List',
            EXPORT_EXCEL: 'Export to excel',
            COPY: 'Copy Trade',
            SPLIT: 'Split Saved'
        },
        DEALOVERVIEW: {
            NAME: 'Deal Overview',
            ERROR: 'Error',
            CREATE: 'Create',
            READ: 'View Deal Overview',
            UPDATE: 'Update',
            SAVE: 'Save Deal Overview',
            DELETE: 'Delete',
            LIST: 'View Deal Overview List',
            TAP_LIST: 'View TAP Code List',
            EXPORT_EXCEL: 'Export to excel',
        },
        REPORT: {
            NAME: 'Reports',
            TRADEFAST: ' TradeFast reports ',
            DEALFAST: ' DealFast reports ',
            TAPFAST: ' TapFast reports ',
            VIEWTRADEFAST: 'View TradeFast reports ',
            VIEWDEALFAST: 'View DealFast reports ',
            VIEWTAPFAST: 'View TapFast reports ',
            CHANGEDATE: 'Filter Date Change ',
            CHANGEQUERYTYPE: 'Change Query Type',
            CHANGECONTRACTSTYPE: 'Change Contracts Type',
            APPLYFILTER: 'Apply Filter',
            EXPORT_EXCEL: 'Export to excel',
        },

    },
    DASHBOARD: {
        NAME: 'Dashboard',
        SUBMODULE: {
            TRADE: 'TradeFast',
            DEAL: 'DealFast',
            TAP: 'TAPFast',
            DEALOVERVIEW: 'Deal Overview'
        },
    },
    MAILREDIRECT: {
        NAME: 'From Mail',
        SUBMODULE: {
            TRADE: 'TradeFast',
            DEAL: 'DealFast',
            TAP: 'TAPFast',
            DASHBOARD: 'Dashboard'
        },
    },
    ANLYSFAST: {
        NAME: 'AnalyseFAST',
        SUBMODULE: {
            TRADE: 'TradeFast'
        },
    },
    BCE: {
        NAME: 'BCE',
        SUBMODULE: {
            M2M: 'M2M',
            NBIOT: 'NB-IoT',
            MIOT: 'M-IoT',
            LTE: 'LTE-M',
            FGNTWRKSLICE: '5G Network Slices',
        }
    },
    DEAL_FAST: {
        NAME: 'DealFast',
        SUBMODULE: {
            ONLINEIOT: 'IOT',
            ONLINENBIOT: 'NB-IoT',
            ONLINEMIOT: 'M-IoT',
            OFFLINEIOT: 'Offline IoT',
            OFFLINENBIOT: 'Offline NB-IoT',
            OFFLINEMIOT: 'Offline M-IoT',
            FGNTWRKSLICE: '5G Network Slices',
            DRAFT: 'Draft',
            CONTRACT_HISTORY: 'Contract History',
            WORKFLOW: 'Contract Workflow'
        }
    },
    CHAT: {
        NAME: 'Chat',
        SUBMODULE: {
            GROUP: 'Group',
            GROUP_UPDATED: 'Group Updated',
            GROUP_CREATED: 'Group Created',
            GROUP_DELETED: 'Group Deleted',
            USER_ADDED: 'User Added',
            USER_REMOVED: 'User Removed',
            USER_LEFT: 'User Left'
        }
    },
    TRADE_FAST: {
        NAME: 'TradeFast',
        SUBMODULE: {
            IOT: 'IOT',
            NBIOT: 'NB-IoT',
            MIOT: 'M-IoT',
            FGNTWRKSLICE: '5G Network Slices',
        },
        BLOTTER: {
            NAME: 'Blotter'
        }
    },
    MASTER_SETUP: {
        NAME: 'Master setup',
        SUBMODULE: {
            USER: 'User',
            GROUP: 'Group',
            OPERATOR: 'Operator',
            REGION: 'Region'
        },
    },
    USER: {
        NAME: 'User',
        SUBMODULE: {
            ACTIVITYLOG: 'Activity Log',
        }
    },
    GEN_SETUP: {
        NAME: 'General setup',
        SUBMODULE: {
            PAGE: 'Page',
            MENU: 'Menu',
            ROLE: 'Role',
            DOMAIN: 'Domain',
            USAGE_REPORTS: {
                NAME: 'Usage Reports',
                SUBMODULE: {
                    USER_REPORT:
                    {
                        NAME: 'User Usage Reports',
                        CHANGEDATE: 'Filter Date Change ',
                        LIST: 'View User Reports List',
                        CHANGEQUERYTYPE: 'Change Query Type',
                        EXPORT_EXCEL: 'Export to excel',
                        NO_COMMENTS: '-',
                    },
                    TRADE_USAGE: {
                        NAME: 'Trade Usage Reports',
                        CHANGEDATE: 'Filter Date Change ',
                        LIST: 'View Trade Reports List',
                        CHANGEQUERYTYPE: 'Change Query Type',
                        EXPORT_EXCEL: 'Export to excel',
                        NO_COMMENTS: '-',
                    },

                    CONTRACT_USAGE:
                    {
                        NAME: 'Contract Usage Reports',
                        CHANGEDATE: 'Filter Date Change ',
                        LIST: 'View Contract Reports List',
                        CHANGEQUERYTYPE: 'Change Query Type',
                        EXPORT_EXCEL: 'Export to excel',
                        NO_COMMENTS: '-',
                    },

                    TAP_USAGE: {
                        NAME: 'Tap Usage Reports',
                        CHANGEDATE: 'Filter Date Change ',
                        LIST: 'View Tap Reports List',
                        CHANGEQUERYTYPE: 'Change Query Type',
                        EXPORT_EXCEL: 'Export to excel',
                        NO_COMMENTS: '-',

                    },
                },
                CHANGEDATE: 'Filter Date Change ',
                LIST: 'View Usage Reports List',
                CHANGEQUERYTYPE: 'Change Query Type',
                EXPORT_EXCEL: 'Export to excel',
                NO_COMMENTS: '-',
            },
        },

    },
    CONTRACT: 'Contract',
    NO_COMMENTS: '-',
    ALERT: 'Email Alert sent',
    FORCE: 'Force',
    TRYING_COMMENTS: 'Trying',
    ERROR: 'Error',
    WARNING: 'Warning',
    AUTO: 'system',
    FEEDBACK: {
        NAME: 'Feedback',
        OPEN: 'Open',
        SUBMIT: 'Submitted'
    },
    DEMO: {
        NAME: 'Demo',
        OPEN: 'Open',
        SUBMIT: 'Submitted'
    },
    FIRST_DRAFT: {
        CREATED: 'created',
        RESTORED: 'restored'
    },
    CONTRACT_UPLOAD_DOC_SIZE: (1043456 * 7),
    CONTRACT_UPLOAD_DOC_MSG: 'File size exceeds 7 MB',
    CONTRACT_UPLOAD_DOC_TYPE_MSG: 'You can only select PDF file',
    CONTRACT_UPLOAD_DOC_HTMLMSG: '7mb',
    CONTRACT_UPLOAD_DOC_SIZE_1MB: (1043456),
    CONTRACT_UPLOAD_DOC_MSG_1MB: 'File size exceeds 1 MB',
    CONTRACT_UPLOAD_DOC_HTMLMSG_1MB: '1mb',
    WORDDOCEXT: [
        'application/msword',
        'application/x-cfb',
        'application/wordperfect',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
    WORDDOCEXT_WITHOUTODT: [
        'application/msword',
        'application/x-cfb',
        'application/wordperfect',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
    EXCELEXT: ['application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.oasis.opendocument.spreadsheet'],
    PDFEXT: ['application/pdf']
};
