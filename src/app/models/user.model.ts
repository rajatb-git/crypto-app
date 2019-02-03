export class UserModel {
    name: string;
    email: string;
    id: string;
    createdOn: Date;
    modifiedOn: Date;

    constructor() {
        this.name = "";
        this.email =  "";
        this.id =  "";
        this.createdOn =  new Date();
        this.modifiedOn =  new Date();
    }
}