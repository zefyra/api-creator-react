export default class Permission {

    // getPermissionMap

    // static getter(type) {
    //     if (type === 'system') {
    //         const permissionMapStr = localStorage.getItem('systemPermission');
    //         return permissionMapStr ? JSON.parse(permissionMapStr) : {};
    //     }
    //     console.error(`unknown permission type: ${type}`);
    //     return;
    // }
    static setter(val) {
        if (!val) {
            console.error(`Accessor Permission setter val not exist`);
            return;
        }
        if (val.type === 'system') {
            localStorage.setItem("systemPermission", JSON.stringify(val.permissionMap));
            return;
        }
    }
    static remover() {
        localStorage.removeItem('systemPermission');
    }

    getPermissionMap(type) {
        if (type === 'system') {
            const permissionMapStr = localStorage.getItem('systemPermission');
            return permissionMapStr ? JSON.parse(permissionMapStr) : null;
        }

        console.error(`unknown permission type: ${type}`);
        return null;
    }
    getPermissionList(type) {
        const permissionMap = this.getPermissionMap(type);
        if (!permissionMap) {
            return null;
        }

        return Object.keys(permissionMap).map((key) => {
            return permissionMap[key];
        });
    }
}