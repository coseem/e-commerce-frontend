import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CounterPartyEnum } from '../../../enums';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { CounterpartyService } from '../../../services';
import { first } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-counterparty-form',
    imports: [CommonModule, ReactiveFormsModule, Card, InputText, Message, Textarea, Button, Divider, Select],
    templateUrl: './counterparty-form.component.html',
    styleUrl: './counterparty-form.component.scss'
})
export class CounterpartyFormComponent implements OnInit {
    public readonly counterpartyForm!: FormGroup;
    public readonly counterpartyTypes = Object.values(CounterPartyEnum); // ['Юр. лицо', 'Физ. лицо', 'ИП']

    private readonly _fb = inject(FormBuilder);
    private readonly _counterpartyService = inject(CounterpartyService);
    private readonly _messageService = inject(MessageService);
    private readonly _router = inject(Router);

    ngOnInit(): void {
        this._initForm();
    }

    private _initForm() {
        (this.counterpartyForm as any) = this._fb.group({
            name: [null, [Validators.required, Validators.minLength(2)]],
            phone: [null, [Validators.pattern('^[+]?[0-9]{5,20}$')]],
            email: [null, [Validators.email]],
            address: [null],
            address_comment: [null],
            comment: [null],
            contacts: this._fb.array([]),
            requisites: this._fb.array([])
        });

        this.addRequisite();
    }

    // Получаем FormArray контактов
    get contacts(): FormArray {
        return this.counterpartyForm.get('contacts') as FormArray;
    }

    // Добавление нового контактного лица
    addContact() {
        const contactForm = this._fb.group({
            full_name: [null, Validators.required],
            position: [null],
            phone: [null, [Validators.pattern('^[+]?[0-9]{5,20}$')]],
            email: [null, Validators.email],
            comment: [null]
        });
        this.contacts.push(contactForm);
    }

    // Удаление контактного лица
    removeContact(index: number) {
        this.contacts.removeAt(index);
    }

    // Получаем FormArray реквизитов
    get requisites(): FormArray {
        return this.counterpartyForm.get('requisites') as FormArray;
    }

    // Добавление нового реквизита
    addRequisite() {
        const requisiteForm = this._fb.group({
            type: [this.counterpartyTypes[0], Validators.required],
            inn: [null, [Validators.pattern('^[0-9]{10,12}$')]],
            full_name: [null],
            legal_address: [null],
            legal_address_comment: [null],
            kpp: [null, [Validators.pattern('^[0-9]{9}$')]],
            ogrn: [null, [Validators.pattern('^[0-9]{13,15}$')]],
            okpo: [null, [Validators.pattern('^[0-9]{8,10}$')]]
        });
        this.requisites.push(requisiteForm);
    }

    // Удаление реквизита
    removeRequisite(index: number) {
        this.requisites.removeAt(index);
    }

    // Отправка формы
    onSubmit() {
        if (this.counterpartyForm.valid) {
            this._counterpartyService.create(this.counterpartyForm.value)
              .pipe(first())
              .subscribe(() => {
                  this._messageService.add({ severity: 'success', summary: 'Успех', detail: 'Контрагент успешно добавлен.', life: 3000 });
                  this._router.navigate(['/counterparties']).then();
              });
        }
    }
}
