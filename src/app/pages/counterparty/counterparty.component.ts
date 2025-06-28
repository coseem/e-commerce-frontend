import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs';
import { CounterpartyService } from '../../services';
import { ICounterParty } from '../../interfaces';

@Component({
    selector: 'app-counterparty',
    imports: [Button, ConfirmDialog, IconField, InputIcon, InputText, RouterLink, TableModule, Toolbar],
    providers: [ConfirmationService],
    templateUrl: './counterparty.component.html',
    styleUrl: './counterparty.component.scss'
})
export class CounterpartyComponent implements OnInit {
    public readonly counterparties = signal<ICounterParty[]>([]);
    public readonly selectedCounterparties = signal<ICounterParty[] | null>(null);

    private readonly _counterpartyService = inject(CounterpartyService);
    private readonly _messageService = inject(MessageService);
    private readonly _confirmationService = inject(ConfirmationService);

    public statuses!: any[];

    @ViewChild('dt') private readonly _dt!: Table;

    exportCSV() {
        this._dt.exportCSV();
    }

    ngOnInit() {
        this._loadCounterparties();
    }

    private _loadCounterparties() {
        this._counterpartyService
            .getAll()
            .pipe(first())
            .subscribe((r) => this.counterparties.set(r));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    deleteSelectedCounterparties() {
        this._confirmationService.confirm({
            message: 'Вы уверены, что хотите удалить выбранные контрагенты?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.counterparties.set(this.counterparties().filter((val) => !this.selectedCounterparties()?.includes(val)));
                this.selectedCounterparties.set(null);
                this._messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Counterparties Deleted',
                    life: 3000
                });
            }
        });
    }

    deleteCounterparty(counterparty: ICounterParty) {
        this._confirmationService.confirm({
            message: 'Вы уверены, что хотите удалить ' + counterparty.name + '?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.counterparties.set(this.counterparties().filter((val) => val.id !== counterparty.id));
                this._messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Counterparty Deleted',
                    life: 3000
                });
            }
        });
    }
}

/*{
  "name": "ООО Ромашка",
  "phone": "+79991234567",
  "email": "info@romashka.ru",
  "address": "г. Москва, ул. Ленина, д. 1",
  "address_comment": "Офис на втором этаже",
  "comment": "Работаем с 2010 года",
  "contacts": [
    {
      "full_name": "Иванов Иван Иванович",
      "position": "Директор",
      "phone": "+79998887766",
      "email": "ivanov@romashka.ru",
      "comment": "Основной контакт"
    }
  ],
  "requisites": [
    {
      "type": "Юр. лицо",
      "inn": "7701234567",
      "full_name": "ООО Ромашка",
      "legal_address": "г. Москва, ул. Ленина, д. 1",
      "legal_address_comment": "Офисное здание",
      "kpp": "770201001",
      "ogrn": "1037700123456",
      "okpo": "12345678"
    }
  ]
}*/
