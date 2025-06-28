import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../services';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { first } from 'rxjs';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interfaces';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
    selector: 'app-product',
    imports: [CommonModule, Toolbar, Button, TableModule, IconField, InputIcon, FormsModule, InputText, ConfirmDialog, RouterLink],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class ProductComponent implements OnInit {
    public readonly products = signal<IProduct[]>([]);
    public readonly selectedProducts = signal<IProduct[] | null>(null);

    private readonly _productService = inject(ProductService);
    private readonly _messageService = inject(MessageService);
    private readonly _confirmationService = inject(ConfirmationService);

    public product!: IProduct;
    public statuses!: any[];
    public exportColumns!: ExportColumn[];
    public cols!: Column[];

    @ViewChild('dt') private readonly _dt!: Table;

    exportCSV() {
        this._dt.exportCSV();
    }

    ngOnInit() {
        this._loadProducts();
    }

    private _loadProducts() {
        this._productService
            .getAll()
            .pipe(first())
            .subscribe((r) => this.products.set(r));

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    deleteSelectedProducts() {
        this._confirmationService.confirm({
            message: 'Вы уверены, что хотите удалить выбранные товары?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => !this.selectedProducts()?.includes(val)));
                this.selectedProducts.set(null);
                this._messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    deleteProduct(product: IProduct) {
        this._confirmationService.confirm({
            message: 'Вы уверены, что хотите удалить ' + product.name + '?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => val.id !== product.id));
                //this.product = {};
                this._messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    private _findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }
}
