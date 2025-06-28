import { Component, Renderer2, ViewChild, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule],
    template: `<div class="layout-wrapper" [ngClass]="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class AppLayout implements OnDestroy {
    private readonly _overlayMenuOpenSubscription: Subscription;
    private _menuOutsideClickListener: any;

    @ViewChild(AppSidebar) private readonly _appSidebar!: AppSidebar;
    @ViewChild(AppTopbar) private readonly _appTopBar!: AppTopbar;

    private readonly _layoutService = inject(LayoutService);
    private readonly _renderer = inject(Renderer2);
    private readonly _router = inject(Router);

    constructor() {
        this._overlayMenuOpenSubscription = this._layoutService.overlayOpen$.subscribe(() => {
            if (!this._menuOutsideClickListener) {
                this._menuOutsideClickListener = this._renderer.listen('document', 'click', (event) => {
                    if (this._isOutsideClicked(event)) {
                        this._hideMenu();
                    }
                });
            }

            if (this._layoutService.layoutState().staticMenuMobileActive) {
                this._blockBodyScroll();
            }
        });

        this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this._hideMenu();
        });
    }

    private _isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    private _hideMenu() {
        this._layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this._menuOutsideClickListener) {
            this._menuOutsideClickListener();
            this._menuOutsideClickListener = null;
        }
        this._unblockBodyScroll();
    }

    private _blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    private _unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this._layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this._layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this._layoutService.layoutState().staticMenuDesktopInactive && this._layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this._layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this._layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this._overlayMenuOpenSubscription) {
            this._overlayMenuOpenSubscription.unsubscribe();
        }

        if (this._menuOutsideClickListener) {
            this._menuOutsideClickListener();
        }
    }
}
