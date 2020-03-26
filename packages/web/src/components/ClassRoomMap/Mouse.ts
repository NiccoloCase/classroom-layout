import { ReferenceSystemType } from './enums';

export class Mouse {
    /** Posizione dell'ultimo click del mouse */
    public lastClickPosition: {
        clientX?: number;
        clientY?: number;
        gridX?: number;
        gridY?: number
    }
    /** Poszione attaule del mouse */
    public mousePosition: {
        clientX?: number;
        clientY?: number;
        gridX?: number;
        gridY?: number
    }

    constructor() {
        this.lastClickPosition = {
            clientX: undefined,
            clientY: undefined,
            gridX: undefined,
            gridY: undefined
        }
        this.mousePosition = {
            clientX: undefined,
            clientY: undefined,
            gridX: undefined,
            gridY: undefined
        }
    }

    /**
     * Restituisce le coordinate dell'ultimo click in vase al sistema di riferimento scleto
     */
    public getLastClickCoords = (referenceSystemType: ReferenceSystemType): Array<number | null | undefined> => {
        if (referenceSystemType === ReferenceSystemType.CANVAS)
            return [
                this.lastClickPosition.clientX,
                this.lastClickPosition.clientY
            ]
        else if (referenceSystemType === ReferenceSystemType.GRID)
            return [
                this.lastClickPosition.gridX,
                this.lastClickPosition.gridY
            ]
        else
            return [null, null]
    }

    /**
     * Restituisce le coordinate del mouse
     */
    public getMousePosition = (referenceSystemType: ReferenceSystemType): Array<number | null | undefined> => {
        if (referenceSystemType === ReferenceSystemType.CANVAS)
            return [
                this.mousePosition.clientX,
                this.mousePosition.clientY
            ]
        else if (referenceSystemType === ReferenceSystemType.GRID)
            return [
                this.mousePosition.gridX,
                this.mousePosition.gridY
            ]
        else
            return [null, null]
    }
}