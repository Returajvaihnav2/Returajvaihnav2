

export class SearchRoles {
    roleName: string;
    roleDescription: string;
    isActive: boolean;
    ID: string;
}

export class RolesModel {
    roleNode: string;
    roleName: string;
    roleCode: string;
    roleDescription: string;
    rolePriority: number;
    menus: any[];
    pages: any[];
    isRoleActive: boolean;
    constructor(item?) {
        if (item) {
            this.roleNode = item.roleNode;
            this.roleName = item.roleName;
            this.roleCode = item.roleCode;
            this.roleDescription = item.roleDescription;
            this.rolePriority = item.rolePriority;
            this.menus = item.menus;
            this.pages = item.pages;
            this.isRoleActive = item.isRoleActive;
        }
    }
}

export class RolesPageMappingModel {
    pageCode: string;
    roleNode: string;
    roleName: string;
    constructor(item?) {
        if (item) {
            this.pageCode = item.pageCode;
            this.roleNode = item.roleNode;
            this.roleName = item.roleName;
        }
    }
}

export class RolesMenuMappingModel {
    menuCode: string;
    roleMenuMappingID: string;
    roleNode: string;
    roleCode: string;
    isRoleMenuMappingActive: boolean;
    isMenuActive: boolean;
    constructor(item?) {
        if (item) {
            this.menuCode = item.menuCode;
            this.roleMenuMappingID = item.roleMenuMappingID;
            this.roleNode = item.roleNode;
            this.roleCode = item.roleCode;
            this.isRoleMenuMappingActive = true;
            this.isMenuActive = item.isMenuActive;
        }
    }
}
