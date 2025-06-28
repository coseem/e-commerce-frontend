import { Component, ElementRef, inject } from '@angular/core';
import { AppMenu } from './menu/app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    public readonly el = inject(ElementRef);
}
