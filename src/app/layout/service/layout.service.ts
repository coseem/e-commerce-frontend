import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';
import { layouts } from 'chart.js';

export interface LayoutConfig {
    preset?: string;
    primary?: string;
    surface?: string | undefined | null;
    darkTheme?: boolean;
    menuMode?: string;
}

interface LayoutState {
    staticMenuDesktopInactive?: boolean;
    overlayMenuActive?: boolean;
    configSidebarVisible?: boolean;
    staticMenuMobileActive?: boolean;
    menuHoverActive?: boolean;
}

interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private readonly _config: LayoutConfig = {
        preset: 'Aura',
        primary: 'emerald',
        surface: null,
        darkTheme: false,
        menuMode: 'static'
    };

    private readonly _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    };

    public readonly layoutConfig = signal<LayoutConfig>({});
    public readonly layoutState = signal<LayoutState>(this._state);
    public readonly transitionComplete = signal<boolean>(false);

    private readonly _configUpdate = new Subject<LayoutConfig>();
    private readonly _overlayOpen = new Subject<any>();
    private readonly _menuSource = new Subject<MenuChangeEvent>();
    private readonly _resetSource = new Subject();

    public readonly menuSource$ = this._menuSource.asObservable();
    public readonly resetSource$ = this._resetSource.asObservable();
    public readonly configUpdate$ = this._configUpdate.asObservable();
    public readonly overlayOpen$ = this._overlayOpen.asObservable();

    public readonly theme = computed(() => (this.layoutConfig()?.darkTheme ? 'light' : 'dark'));
    public readonly isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive);
    public readonly isDarkTheme = computed(() => this.layoutConfig().darkTheme);
    public readonly getPrimary = computed(() => this.layoutConfig().primary);
    public readonly getSurface = computed(() => this.layoutConfig().surface);
    public readonly isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    private _initialized = false;

    constructor() {
        const getLayoutConfig = localStorage.getItem('layoutConfig');

        if (getLayoutConfig) {
            Object.assign(this._config, JSON.parse(getLayoutConfig));
        }

        this.layoutConfig.set(this._config);

        effect(() => {
            const config = this.layoutConfig();
            if (config) {
                this._onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();
            if (!this._initialized || !config) {
                this._initialized = true;
                return;
            }

            this._handleDarkModeTransition(config);
        });
    }

    private _handleDarkModeTransition(config: LayoutConfig): void {
        if ((document as any).startViewTransition) {
            this._startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this._onTransitionEnd();
        }
    }

    private _startViewTransition(config: LayoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });

        transition.ready
            .then(() => {
                this._onTransitionEnd();
            })
            .catch(() => {});
    }

    toggleDarkMode(config?: LayoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    private _onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({ ...prev, overlayMenuActive: !this.layoutState().overlayMenuActive }));

            if (this.layoutState().overlayMenuActive) {
                this._overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({ ...prev, staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive }));
        } else {
            this.layoutState.update((prev) => ({ ...prev, staticMenuMobileActive: !this.layoutState().staticMenuMobileActive }));

            if (this.layoutState().staticMenuMobileActive) {
                this._overlayOpen.next(null);
            }
        }
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    private _onConfigUpdate() {
        Object.assign(this._config, this.layoutConfig());
        this._configUpdate.next(this.layoutConfig());

        localStorage.setItem('layoutConfig', JSON.stringify(this.layoutConfig()));
    }

    onMenuStateChange(event: MenuChangeEvent) {
        this._menuSource.next(event);
    }

    reset() {
        this._resetSource.next(true);
    }
}
