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
import { CounterpartyService } from '../../services/counterparty.service';
import { ICounterparty } from '../../interfaces/counterparty.model';

@Component({
    selector: 'app-counterparty',
    imports: [Button, ConfirmDialog, IconField, InputIcon, InputText, RouterLink, TableModule, Toolbar],
    providers: [ConfirmationService],
    templateUrl: './counterparty.component.html',
    styleUrl: './counterparty.component.scss'
})
export class CounterpartyComponent implements OnInit {
    counterparties = signal<ICounterparty[]>([]);
    selectedCounterparties!: ICounterparty[] | null;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;

    private counterpartyService = inject(CounterpartyService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.counterpartyService
            .getAll()
            .pipe(first())
            .subscribe((r) => this.counterparties.set(r));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Вы уверены, что хотите удалить выбранные товары?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.counterparties.set(this.counterparties().filter((val) => !this.selectedCounterparties?.includes(val)));
                this.selectedCounterparties = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    deleteProduct(product: ICounterparty) {
        this.confirmationService.confirm({
            message: 'Вы уверены, что хотите удалить ' + product.name + '?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.counterparties.set(this.counterparties().filter((val) => val.id !== product.id));
                //this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
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