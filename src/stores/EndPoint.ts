import { action, makeObservable, observable } from 'mobx';

export class EndPoint {
    readonly Base: string;
    readonly PublicRoute: string;
    readonly AuthorizedRoute: string;

    @observable accessor publicRouteLoaded = false;

    @observable accessor authorizedRouteLoaded = false;

    constructor(Base: string, config: { public?: boolean | string; authorized?: boolean | string } = {}) {
        this.Base = Base;
        this.PublicRoute =
            config.public && typeof config.public === 'string' ? config.public : config.public ? Base : '';
        this.AuthorizedRoute =
            config.authorized && typeof config.authorized === 'string'
                ? config.authorized
                : config.authorized
                  ? Base
                  : '';
    }

    get hasPublicRoute() {
        return !!this.PublicRoute;
    }

    get hasAuthorizedRoute() {
        return !!this.AuthorizedRoute;
    }

    loaded(type: 'public' | 'authorized' | 'all' = 'all') {
        switch (type) {
            case 'public':
                return this.hasPublicRoute ? this.publicRouteLoaded : true;
            case 'authorized':
                return this.hasAuthorizedRoute ? this.authorizedRouteLoaded : true;
            case 'all':
                return this.loaded('public') && this.loaded('authorized');
        }
    }

    routeWithSemesterId(type: 'public' | 'base' | 'authorized', semesterId?: string) {
        switch (type) {
            case 'public':
                return semesterId ? `${this.PublicRoute}?semesterId=${semesterId}` : this.PublicRoute;
            case 'authorized':
                return semesterId ? `${this.AuthorizedRoute}?semesterId=${semesterId}` : this.AuthorizedRoute;
            case 'base':
                return semesterId ? `${this.Base}?semesterId=${semesterId}` : this.Base;
        }
    }

    @action
    setLoaded(type: 'public' | 'authorized') {
        switch (type) {
            case 'public':
                this.publicRouteLoaded = true;
                break;
            case 'authorized':
                this.authorizedRouteLoaded = true;
                break;
        }
    }

    @action
    reset(type: 'public' | 'authorized' | 'all' = 'all') {
        if (type === 'public' || type === 'all') {
            this.publicRouteLoaded = false;
        }
        if (type === 'authorized' || type === 'all') {
            this.authorizedRouteLoaded = false;
        }
    }
}
