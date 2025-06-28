import { IContactPerson } from './contact-person';
import { IRequisite } from './requisite.interface';

export interface ICounterParty {
    id?: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    address_comment?: string;
    comment?: string;
    contacts: IContactPerson[];
    requisites: IRequisite[];
}
