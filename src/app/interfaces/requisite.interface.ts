import { CounterPartyEnum } from '../enums';

export interface IRequisite {
    id?: number;
    type: CounterPartyEnum;
    inn?: string;
    full_name?: string;
    legal_address?: string;
    legal_address_comment?: string;
    kpp?: string;
    ogrn?: string;
    okpo?: string;
}
