import { Component, HostListener, inject, input, OnInit } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ProductService } from '../../../services/product.service';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Divider } from 'primeng/divider';
import { first, take } from 'rxjs';
import { cleanObject } from '../../../operators/clean-object';
import { CategoryService } from '../../../services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';
import {
    CategoryEditDialogComponent
} from '../../setting/category/category-edit-dialog/category-edit-dialog.component';
import { ICategory } from '../../../interfaces/category.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { CountryService } from '../../../services/country.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ICountry } from '../../../interfaces/country.interface';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UnitService } from '../../../services/unit.service';

@Component({
    selector: 'app-product-edit',
    imports: [InputText, TextareaModule, FormsModule, ReactiveFormsModule, Button, Select, Divider, AutoCompleteModule],
    templateUrl: './product-edit.component.html',
    styleUrl: './product-edit.component.scss',
    providers: [ProductService, DialogService]
})
export class ProductEditComponent implements OnInit {
    public id = input<string>();
    public form: FormGroup;
    public categories = rxResource({
        loader: () => this.categoryService.getAll()
    });
    public units = rxResource({
        loader: () => this.unitService.getAll()
    });
    public countries: ICountry[] = [];
    public filteredCountries: ICountry[] = [];
    private buffer: string = ''; // Буфер для накопления символов
    private lastKeyTime: number = 0; // Время последнего ввода
    private productService = inject(ProductService);
    private categoryService = inject(CategoryService);
    private countryService = inject(CountryService);
    private unitService = inject(UnitService);
    private dialogService = inject(DialogService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    constructor() {
        this.form = new FormGroup({
            id: new FormControl(null),
            name: new FormControl(null, [Validators.required]),
            barcode: new FormControl(null),
            sku: new FormControl(null),
            category: new FormControl(null),
            purchasePrice: new FormControl(null),
            salePrice: new FormControl(null),
            description: new FormControl(null),
            country: new FormControl(null),
            counterparty: new FormControl(null),
            unit: new FormControl(null),
            weight: new FormControl(0),
            volume: new FormControl(0)
        });
    }

    ngOnInit() {
        this.getProduct();
        this.getCountry();
    }

    submit() {
        const formData = cleanObject(this.form.value);
        this.productService
            .create(formData)
            .pipe(first())
            .subscribe((product) => {
                this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Товар успешно добавлен.', life: 3000 });
                this.router.navigate(['/products']).then();
            });
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - this.lastKeyTime;

        if (timeDiff < 100) {
            this.buffer += event.key;
        } else {
            this.buffer = event.key;
        }

        this.lastKeyTime = currentTime;

        if (event.key === 'Enter' || this.buffer.endsWith('Ente')) {
            this.processBuffer();
        }
    }

    addCategory() {
        this.dialogService
            .open(CategoryEditDialogComponent, {
                header: 'Добавить категорию',
                modal: true,
                closable: true,
                focusOnShow: false,
                style: { width: '350px' },
                breakpoints: {
                    '576px': '320px'
                }
            })
            .onClose.pipe(take(1))
            .subscribe((r: ICategory) => {
                if (!r) return;
                this.categories.value.update((values) => [...values!, r]);
                this.form.get('category')?.setValue(r.id);
            });
    }

    searchCountry(e: AutoCompleteCompleteEvent) {
        this.filteredCountries = this.countries.filter(i => i.name.toLowerCase().includes(e.query.toLowerCase()));
    }

    private processBuffer(): void {
        this.form.get('barcode')?.setValue(this.buffer.replace(/Ente?r?$/, ''));
        this.buffer = '';
    }

    private getProduct() {
        if (this.id() === 'new') return;

        this.productService
            .getOne(this.id()!)
            .pipe(first())
            .subscribe((product) => {
                this.form.patchValue(product);
            });
    }

    private getCountry() {
        this.countryService.getAll()
        .pipe(first())
        .subscribe((countries) => {
            this.countries = this.filteredCountries = countries;
        })
    }
}
