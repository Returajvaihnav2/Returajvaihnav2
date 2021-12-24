import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { UserRolePermissionListModel } from '../models/user-role-permission.model';

@Pipe({
    name: 'permissionPipe'
})
export class PermissionPipe implements PipeTransform {
    rolesList: UserRolePermissionListModel[];
    constructor(private userService: UserService) {
        this.rolesList = this.userService.rolesList;
    }

    transform(query: string): any {
        if (query) {
            const perms = query.split(',');
            let displayPerms = '';
            perms.forEach((element, index) => {
                if (element) {
                    const role = this.rolesList.filter(x => x.roleCode.toLocaleLowerCase() === element.toLocaleLowerCase());
                    if (role && role.length > 0) {
                        displayPerms += (index !== 0 ? ',' : '') + role[0].roleName;
                    }
                }
            });
            return displayPerms;
        } else {
            return query;
        }
    }
}
