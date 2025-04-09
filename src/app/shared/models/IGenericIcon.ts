export interface GenericIcon<T> {
    id: string;
    name: string;
    type: string;
    tooltip?: string;
    transitionIcon?: GenericIcon<T>;
    executeAction(dato: T): void;
}

export class IconOption<T> implements GenericIcon<T> {
    id!: string;
    name: string;
    type: string;
    tooltip?: string;
    transitionIcon?: IconOption<T>;
    actionIcono!: (data?: T) => void;

    constructor(name: string, type: string, tooltip?: string, transitionIcon?: IconOption<T>, id?: string) {
        this.name = name;
        this.type = type;
        if(tooltip) this.tooltip = tooltip ?? null;
        if(transitionIcon) this.transitionIcon = transitionIcon ?? null;
        if(id) this.id = id ?? null;
    }

    executeAction(elemento: T): void {
        this.actionIcono(elemento);
    }
}
