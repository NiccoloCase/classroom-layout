import { Orientation } from './enums';
import { DeskInput } from '../../generated/graphql';
import * as Color from "color";
import { classroomMapColors } from "."

interface DeskRenderOptions {
    /** Se il banco è selezionato */
    isHighlighted?: boolean;
    /** Stile */
    style?: {
        desksFillColor?: string | null;
        desksStrokeColor?: string | null;
        textColor?: string | null;
    };
}

export class Desk {
    /**
     * Funzione che converte una array di oggetti in uno di Desks
     * @param desks 
     */
    static objsToDesks(desksObjs: DeskInput[]): Desk[] {
        const desks = [];
        for (const obj of desksObjs) {
            desks.push(
                new this(obj.x, obj.y, obj.orientation)
            );
        }
        return desks;
    }

    /**
     * Funzione che converte i banchi passati nel formato oggetto
     * @param desks 
     */
    static desksToObjs(desks: Desk[]): DeskInput[] {
        return desks.map(desk => desk.object);
    }

    /**
     * Associa ogni banco dell'array passato a un nome dell'array di studenti
     * @param desks Array di banchi
     * @param students Nomi
     */
    static setNames(desks: Desk[], students: string[]) {
        if (desks.length !== students.length)
            throw new Error("Il numero di banchi e il numero di sudenti deve essere ugaule");
        for (let i = 0; i < desks.length; i++) {
            desks[i].name = students[i];
        }
    }

    /**
     * Trasla i banchi contenuti nell'array passato al punto all'origine (0,0)
     * @param desks Banchi da traslare
     */
    static centerDesks(desks: DeskInput[]): Desk[] {
        const benches = Desk.objsToDesks(desks);
        // trova le componenti del vettore per le traslazioni 
        // (coincidono con la distanza dagli assi del banco a loro piu' vicino)   
        const offsetX = Math.min(...benches.map(desk => Math.min(desk.x1, desk.x2)));
        const offsetY = Math.min(...benches.map(desk => Math.min(desk.y1, desk.y2)));
        // ESEGUE LA TRASLAZIONE 
        for (const desk of benches) {
            // traslazione orizzontale
            desk.x1 = desk.x1 - offsetX;
            desk.x2 = desk.x2 - offsetX;
            // traslazione veritcale
            desk.y1 = desk.y1 - offsetY;
            desk.y2 = desk.y2 - offsetY;
        }
        return benches;
    }

    x1: number;
    y1: number;
    x2: number;
    y2: number;
    name: string;
    orientation: Orientation;

    constructor(x: number, y: number, orientation: Orientation) {
        this.orientation = orientation;
        this.x1 = x;
        this.y1 = y;

        if (orientation === Orientation.N) {
            this.x2 = x;
            this.y2 = y - 1;
        }
        else if (orientation === Orientation.E) {
            this.x2 = x + 1;
            this.y2 = y;
        }
        else if (orientation === Orientation.S) {
            this.x2 = x;
            this.y2 = y + 1;
        }
        else if (orientation === Orientation.W) {
            this.x2 = x - 1;
            this.y2 = y;
        }
    }

    /**
     * Disegna il banco
     * @param ctx 
     * @param options 
     */
    render(ctx: CanvasRenderingContext2D, options: DeskRenderOptions = {}) {
        // CALCOLA LE DIMENSIONI
        const x = this.x1 < this.x2 ? this.x1 : this.x2;
        const y = this.y1 > this.y2 ? this.y2 : this.y1;
        let d;
        let h;
        if (this.orientation === Orientation.N || this.orientation === Orientation.S) {
            d = 1;
            h = 2;
        } else {
            d = 2;
            h = 1;
        }

        // DISEGNA I BANCHI
        const defaultStyle = classroomMapColors.light;

        // colori
        const style = options.style || {};
        ctx.fillStyle = style.desksFillColor || defaultStyle.desksFillColor!;
        ctx.strokeStyle = style.desksStrokeColor || defaultStyle.desksStrokeColor!;
        // Se il banco è selezionato
        if (options && options.isHighlighted) {
            const fill = new Color(ctx.fillStyle);
            const stroke = new Color(ctx.strokeStyle);
            ctx.fillStyle = fill.isLight() ? fill.darken(0.2).hex() : fill.lighten(0.2).hex();
            ctx.strokeStyle = stroke.isLight() ? stroke.darken(0.2).hex() : stroke.lighten(0.2).hex()
        }
        ctx.lineWidth = 0.03;

        if (style.desksFillColor !== null) ctx.fillRect(x, y, d, h);
        if (style.desksStrokeColor !== null) ctx.strokeRect(x, y, d, h);

        // DISEGNA IL NOME DELL'ALLUNNO SUL BANCO
        if (this.name && style.textColor !== null) {
            const defaultSize = d / 6;
            const size = (defaultSize > d / (this.name.length / 1.5)) ?
                (d) / (this.name.length / 1.5) :
                defaultSize

            ctx.font = `${size}px Arial`;
            ctx.fillStyle = style.textColor || defaultStyle.textColor!;
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText(this.name, x + d / 2, y + h / 2);
        }
    }

    get object(): DeskInput {
        const obj = { x: this.x1, y: this.y1, orientation: this.orientation };
        return obj;
    }
}