import { ReferenceSystemType } from './enums';

export class Mouse {
    /** Posizione dell'ultimo click del mouse */
    public lastClickPosition: {
        canvasX?: number;
        canvasY?: number;
        gridX?: number;
        gridY?: number;
        screenX?: number;
        screenY?: number;
    }
    /** Poszione attaule del mouse */
    public mousePosition: {
        canvasX?: number;
        canvasY?: number;
        gridX?: number;
        gridY?: number;
        screenX?: number;
        screenY?: number;
    }

    /** Se il mosue sta venendo trascinato */
    public mouseHeld: boolean;

    constructor() {
        this.lastClickPosition = {
            canvasX: undefined,
            canvasY: undefined,
            gridX: undefined,
            gridY: undefined,
            screenX: undefined,
            screenY: undefined
        }
        this.mousePosition = {
            canvasX: undefined,
            canvasY: undefined,
            gridX: undefined,
            gridY: undefined,
            screenX: undefined,
            screenY: undefined
        }
    }

    /**
     * Restituisce le coordinate dell'ultimo click in vase al sistema di riferimento scleto
     */
    public getLastClickCoords = (referenceSystemType: ReferenceSystemType): Array<number | null | undefined> => {
        switch (referenceSystemType) {
            case ReferenceSystemType.CANVAS:
                return [
                    this.lastClickPosition.canvasX,
                    this.lastClickPosition.canvasY
                ];
            case ReferenceSystemType.GRID:
                return [
                    this.lastClickPosition.gridX,
                    this.lastClickPosition.gridY
                ];
            case ReferenceSystemType.SCREEN:
                return [
                    this.lastClickPosition.screenX,
                    this.lastClickPosition.screenY
                ];
            default:
                return [null, null]
        }
    }

    /**
     * Restituisce le coordinate del mouse
     */
    public getMousePosition = (referenceSystemType: ReferenceSystemType): Array<number | null | undefined> => {
        switch (referenceSystemType) {
            case ReferenceSystemType.CANVAS:
                return [
                    this.mousePosition.canvasX,
                    this.mousePosition.canvasY
                ];
            case ReferenceSystemType.GRID:
                return [
                    this.mousePosition.gridX,
                    this.mousePosition.gridY
                ];
            case ReferenceSystemType.SCREEN:
                return [
                    this.mousePosition.screenX,
                    this.mousePosition.screenY
                ];
            default:
                return [null, null]
        }
    }
}