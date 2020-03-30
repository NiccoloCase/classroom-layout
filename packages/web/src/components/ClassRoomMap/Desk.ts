import { Orientation } from './enums';

export class Desk {

    /**
     * Funzione che converte una stringa JSON in un array di Desks
     * @param json 
     */
    static jsonToDesks(json: string): Desk[] {
        const array = JSON.parse(json);
        const desks = [];
        for (const obj of array) {
            desks.push(
                new this(obj.x, obj.y, obj.orientation)
            );
        }
        return desks;
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

    x1: number;
    y1: number;
    x2: number;
    y2: number;
    orientation: Orientation;
    name: string;

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

    render(ctx: CanvasRenderingContext2D) {
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

        // DISEGNA IL BANCO

        const xw = true;
        if (xw) {
            ctx.fillStyle = "#5f6368";
            ctx.strokeStyle = "#303030";
            // ctx.lineWidth = 0.05;
            ctx.lineWidth = 0.03;
        } else {
            ctx.fillStyle = "#ecf0f1";
            ctx.strokeStyle = "#dadce0";
            ctx.lineWidth = 0.03;
        }

        ctx.fillRect(x, y, d, h);
        ctx.strokeRect(x, y, d, h);

        // DISEGNA IL NOME DELL'ALLUNNO SUL BANCO
        if (this.name) {
            const defaultSize = d / 6;
            const size = (defaultSize > d / (this.name.length / 1.5)) ?
                (d) / (this.name.length / 1.5) :
                defaultSize

            ctx.font = `${size}px Arial`;
            ctx.fillStyle = "#404040";
            ctx.fillStyle = "#f5f5f5";
            // ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText(this.name, x + d / 2, y + h / 2);
        }
    }

    get object(): { x: number, y: number, orientation: Orientation, name?: string } {
        const obj = {
            x: this.x1, y: this.y1, orientation: this.orientation, name: this.name
        };
        return obj;
    }
}