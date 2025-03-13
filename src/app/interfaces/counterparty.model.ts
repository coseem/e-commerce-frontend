export enum CounterpartyType {
  LEGAL_ENTITY = 'Юр. лицо',
  INDIVIDUAL = 'Физ. лицо',
  ENTREPRENEUR = 'ИП'
}

export interface ICounterparty {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  address_comment?: string;
  comment?: string;
  contacts: ContactPerson[];
  requisites: Requisite[];
}

export interface ContactPerson {
  full_name: string;
  position?: string;
  phone?: string;
  email?: string;
  comment?: string;
}

export interface Requisite {
  type: CounterpartyType;
  inn?: string;
  full_name: string;
  legal_address?: string;
  legal_address_comment?: string;
  kpp?: string;
  ogrn?: string;
  okpo?: string;
}
