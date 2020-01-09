export class SettingsModel {
    favCurrency: string;

    constructor() {
        this.favCurrency = "";
    }
}

export class UserModel {
    name: string;
    email: string;
    id: string;
    createdOn: Date;
    modifiedOn: Date;
    settings: SettingsModel;

    constructor() {
        this.name = "";
        this.email =  "";
        this.id =  "";
        this.createdOn =  new Date();
        this.modifiedOn =  new Date();
        this.settings = new SettingsModel();
    }
}