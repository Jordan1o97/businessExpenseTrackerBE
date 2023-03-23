import { v4 as UUID } from "uuid";
import { getCurrentUserId } from "../globals";

export class Client {
    id: string;
    name: string;
    userId: string;
    emailAddress?: string;
    officePhone?: string;
    mobilePhone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateOrProvince?: string;
    postalCode?: string;
    country?: string;
  
    constructor(
        name: string, 
        emailAddress?: string,
        officePhone?: string,
        mobilePhone?: string,
        addressLine1?: string,
        addressLine2?: string,
        city?: string,
        stateOrProvince?: string,
        postalCode?: string,
        country?: string,
    ) {
        this.id = UUID();
        this.name = name;
        this.userId = getCurrentUserId();
        this.emailAddress = emailAddress;
        this.officePhone = officePhone;
        this.mobilePhone = mobilePhone;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.stateOrProvince = stateOrProvince;
        this.postalCode = postalCode;
        this.country = country;
    }
}