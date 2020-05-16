import * as React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMousePointer, faEraser, faTrash, faSearchPlus, faSyncAlt, faTimes, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import Popup from "reactjs-popup";
import * as styles from "./DrawLayout.module.scss";
import { DeskInput } from '../../generated/graphql';
import { ToolType, ReferenceSystemType as RSType, Orientation } from './enums';
import { Mouse } from './Mouse';
import { Desk } from "./Desk";
import { IClassroomMapColors } from "./";

interface ClassRoomMapProps {
    /** Se la mappa è statica o interattiva */
    static?: boolean;
    /** Larghezza del canvas */
    width: number;
    /** Altezza del canvas */
    height: number;
    /** NUmero massimo di banchi */
    maxDesks?: number;
    /** Se la configurazione non è modificabile */
    notEditable?: boolean;
    /** Banchi */
    desks?: DeskInput[];
    /** Banchi inizali */
    defaultDesks?: DeskInput[];
    /** Dimnesione delle celle */
    scale?: number;
    /** Array di studenti */
    students?: string[];
    /** Indice del banco evidenziato */
    highlightedDesk?: number;
    /** Disattiva la funzione che centra i banchi ad ogni loro cambiamento */
    disableAutofocus?: boolean;
    /** Stile */
    style?: IClassroomMapColors;
    /** Nome della classe HTML */
    className?: string;
    // FUNZIONI
    /**
     * Funzione chiamata ogni vole che avviene un cambiamento 
     * @param desksRow Array di banchi (nel formato oggetto) nella posizione i cui sono stati collocati
     */
    handleChanges?: (desksRaw: DeskInput[]) => void;
    /**
     * Funziuone chiamata quando un banco viene selezionato
     * @param desks Index del banco
     */
    onDeskIsHighlighted?: (index: number | null) => void;
}

interface ClassRoomMapState {
    /** Larghezza del canvas */
    width: number;
    /** Altezza del canvas */
    height: number;
    /** Strumento in uso */
    tool: ToolType;
    /** Orientamento con cui vengono posizionati i blocchi */
    orientation: Orientation,
    /** Orientamento non voluto dall'utente ma proposto a seconda della situazione */
    recommendedOrientation: {
        /** orientamento suggerito */
        value: Orientation | null,
        /** cella in cui è avvenuto il suggerimento */
        cell: number[]
    },
    /** Valore dello zoom */
    zoom: number
}

class ClassRoomMap extends React.Component<ClassRoomMapProps> {
    // CANVAS
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    /** Banchi */
    desks: Desk[];
    /** Cronologia dei banchi */
    desksHistory: Desk[][] = [];
    /** Studenti */
    students?: string[];
    /** dimensione di una cela */
    defaultScale: number;
    scale: number;
    /** Intervallo di zoom */
    deltaZoom: number;
    /** Mouse */
    mouse: Mouse;
    /** Banco evidenziato */
    highlightedDesk?: number | null;
    /** Stato */
    state: ClassRoomMapState;

    constructor(props: ClassRoomMapProps) {
        super(props);
        // STATO
        this.state = {
            width: this.props.width,
            height: this.props.height,
            tool: this.props.notEditable ? ToolType.POINTER : ToolType.ADD,
            orientation: Orientation.E,
            recommendedOrientation: { value: null, cell: [] },
            zoom: 1
        };
        // BANCHI
        this.highlightedDesk = props.highlightedDesk;
        if (props.defaultDesks) this.desks = Desk.centerDesks(props.defaultDesks);
        else if (props.desks) this.desks = Desk.centerDesks(props.desks)
        else this.desks = [];
        // STUDENTI
        this.students = props.students;
        if (this.students && this.desks.length > 0) Desk.setNames(this.desks, this.students);
        // SCALA E ZOOM
        this.defaultScale = props.scale ||
            this.getScale(this.state.width, this.state.height, this.desks);
        this.scale = this.defaultScale;
        this.deltaZoom = 5;
    }

    componentDidMount() {
        // CANVAS
        this.ctx = this.canvas.getContext("2d")!;
        // EVENTI
        if (!this.props.static) {
            this.mouse = new Mouse();
            this.canvas.addEventListener("mousedown", this.onMouseClick);
            this.canvas.addEventListener("mousemove", this.onMouseMove);
        }
        // AVVIA IL LOOP
        this.tick();
    }

    componentWillUnmount() {
        // rimuove gli eventi
        this.canvas.removeEventListener("mousedown", this.onMouseClick);
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
    }

    componentDidUpdate(prevProps: ClassRoomMapProps, prevState: ClassRoomMapState) {
        // VARIAZIONE NEI BANCHI
        if (this.props.desks && this.desks !== Desk.objsToDesks(this.props.desks)) {
            // controlla se deve centare i banchi
            if (!this.props.disableAutofocus) {
                this.desks = Desk.centerDesks(this.props.desks);
                // imposta la nuova scala
                this.defaultScale = this.getScale(this.props.width, this.props.height, this.desks);
                this.scale = this.defaultScale;
            }
            else this.desks = Desk.objsToDesks(this.props.desks);
            // associa gli studenti ai nuovi banchi 
            if (this.students) Desk.setNames(this.desks, this.students);
        }

        // VARIAZIONE DEGLI STUDENT
        if (this.props.students !== this.students) {
            this.students = this.props.students;
            if (this.students) Desk.setNames(this.desks, this.students);
        }

        // VARIAZIONE DEL BANCO SELEZIONATO 
        if (this.highlightedDesk !== this.props.highlightedDesk)
            this.highlightedDesk = this.props.highlightedDesk;

        // VARIAZIONE DELLE DIMENSIONI
        if (this.props.width !== prevState.width || this.props.height !== prevState.height) {
            // aggiorna le dimensioni
            this.setState({ width: this.props.width, height: this.props.height });
            // imposta la nuova scala
            this.defaultScale = this.getScale(this.props.width, this.props.height, this.desks);
            this.scale = this.defaultScale;
        }
    }

    render() {
        return (
            <div id="ClassroomMap" className={this.props.className}>
                {!this.props.notEditable && this.drawTools()}
                <canvas ref={c => (this.canvas = c!)} width={this.state.width} height={this.state.height} />
            </div>
        );
    }

    /**
     * Disegna la barra degli strumenti
     */
    private drawTools = () => (
        <div className={styles.tools}>
            {/* Puntatore */}
            <button onClick={() => this.switchTool(ToolType.POINTER)} className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.POINTER })}>
                <FontAwesomeIcon icon={faMousePointer} />
            </button>
            {/* Strumento aggiungi */}
            <button onClick={() => this.switchTool(ToolType.ADD)} className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.ADD })}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
            {/* Strumento rimuovi */}
            <button onClick={() => this.switchTool(ToolType.REMOVE)} className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.REMOVE })} >
                <FontAwesomeIcon icon={faEraser} />
            </button>
            <div className={styles.actions}>
                {/* Orientamento banchi */}
                <button onClick={() => this.swtichOrientation()} className={styles.action}>
                    <FontAwesomeIcon icon={faSyncAlt} />
                </button>
                {/* Zoom */}
                <Popup trigger={
                    <button className={styles.action}>
                        <FontAwesomeIcon icon={faSearchPlus} />
                    </button>} closeOnDocumentClick position="bottom center">
                    <div className={styles.zoomPopUp}>
                        <input type="range" min={0.2} max={2} step={0.1}
                            value={this.state.zoom} onChange={this.changeZoom} />
                    </div>
                </Popup>
                {/* Cestino */}
                <Popup trigger={
                    <button className={styles.action}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>} closeOnDocumentClick position="bottom center">
                    {close => (
                        <div className={styles.trashPopUp}>
                            <div className={styles.left}>
                                <div>Sei sicuro di volere cancellare tutti i banchi?</div>
                                <button onClick={() => { this.delateAll(); close(); }}>Cancella</button>
                            </div>
                            <div className={styles.right}>
                                <button><FontAwesomeIcon icon={faTimes} onClick={close} /></button>
                            </div>
                        </div>)}
                </Popup>
                {/* Torna indietro */}
                <button onClick={this.undo} className={styles.action}
                    disabled={this.desksHistory.length < 1}>
                    <FontAwesomeIcon icon={faUndoAlt} />
                </button>
            </div>
        </div>);

    /**
     * Chaiama la funzione passata tra le proprietà 
     */
    private callback = () => {
        // verifica se la funzione è stata passata tra le proprietà
        if (typeof this.props.handleChanges === "function")
            this.props.handleChanges(Desk.desksToObjs(this.desks));
    }

    /**
     * Cambia il tipo di strumento selezionato
     */
    private switchTool = (tool: ToolType) => {
        this.setState({ tool });
    }

    /**
     * Cambia l'orientamento dei banchi che veranno aggiunti.
     * Se viene passato un orientamento viene impostato quello, 
     * se no viene cambaito in ordine ciclico
     */
    private swtichOrientation = (orientation?: Orientation) => {
        if (orientation) this.setState({ orientation });
        else {
            const index = Orientation[Orientation[this.state.orientation]];
            const orientations = Object.keys(Orientation).length / 2;
            this.setState({
                orientation: this.state.orientation < orientations - 1 ? index + 1 : 0
            })
        }
    }

    /**
     * Funzione che ripristina l'ultimo cambiamento nella cronologia
     */
    private undo = () => {
        // ultima configurazione
        const previousLayout = this.desksHistory[this.desksHistory.length - 1];
        if (previousLayout === undefined) return;
        // ripristina 'ultima configurazione
        this.desks = previousLayout;
        // elimina l'ultimo elemento dell'array
        this.desksHistory.length = this.desksHistory.length - 1;
        // se non è rimasato nessun altro salvateggio vecchio 
        // riaggiorna il componente 
        if (this.desksHistory.length === 0) this.forceUpdate();
        // chiama la funzione callback
        this.callback();
    }

    /**
     * Funzione chiamata quando viene cliccato il mouse all'interno del canvas
     */
    private onMouseClick = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const [gridX, gridY] = this.switchToGridCoord(clientX, clientY);
        // ragistra la posizione del click
        this.mouse.lastClickPosition = { clientX, clientY, gridX, gridY }
        // STRUMENTI
        if (this.state.tool === ToolType.POINTER) this.highlightDesk(gridX, gridY);
        if (this.state.tool === ToolType.ADD) this.addDesk(gridX, gridY);
        else if (this.state.tool === ToolType.REMOVE) this.removeDesk(gridX, gridY);
    }

    /**
     * Funzione chiamata al movimento del mouse
     */
    private onMouseMove = (e: MouseEvent) => {
        // AGGIORNA LA POSIZIONE DEL MOUSE
        // calcola la posizione attuale del mouse
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const [gridX, gridY] = this.switchToGridCoord(clientX, clientY);
        // imposta la posizione attuale del mouse
        this.mouse.mousePosition = { clientX, clientY, gridX, gridY }

        // Se l'utente ha mosso il cursore dalla cella in cui era stato cambiata l'orientamento 
        // automaticamente come suggerimento, ripristina l'orinetamento originale
        if (this.state.recommendedOrientation.value != null && (this.state.recommendedOrientation.cell[0] !== gridX || this.state.recommendedOrientation.cell[1] !== gridY)) {
            this.setState({ recommendedOrientation: { value: null, cell: [] } });
        }
    }

    /**
     * Restiruisce la scala piu' adeguata per le dimensioni passate.
     * Se viene passato anche un array di banchi, il calcolo della scala 
     * prenderà in considerazione anche la disposizione di questi.
     */
    private getScale = (width: number, height: number, desks?: Desk[]): number => {
        // CONFIGURAZIONE SENZA BANCHI
        // nel calcolo della scala prende in considerazione solo le dimensioni del canvas
        if (!desks || desks.length === 0) {
            const minScale = 35;
            const scaleX = width / 18;
            const scaleY = height / 6;
            const scale = Math.min(scaleX, scaleY);
            return scale < minScale ? minScale : scale;
        }
        // CONFIGURAZIONE CON BANCHI
        // nel calcolo della scala prende in considerazione anche la disposizione dei banchi
        else {
            // trova il numero di celle occupate sull'asse x
            const nX = Math.max(...desks.map(desk => Math.max(desk.x1, desk.x2))) + 1;
            // trova il numero di celle occupate sull'asse y
            const nY = Math.max(...desks.map(desk => Math.max(desk.y1, desk.y2))) + 1;
            // trova le scale: una in base alla larghezza e l'altra all'altezza 
            const scaleX = width / nX;
            const scaleY = height / nY;
            // considera solo la scala piu' opportuna tra le due 
            const scale = Math.min(scaleX, scaleY);
            // valore massimo della scala al fine di impedire preview toppo zoommate 
            const maxScale = this.props.static ? Infinity : 100;
            return scale < maxScale ? scale : maxScale;
        }
    }

    /**
     * Trasforma delle coordinate in pixel in coordinate i celle
     */
    private switchToGridCoord = (x: number, y: number): number[] => {
        const gridX = Math.floor(x / this.scale);
        const gridY = Math.floor(y / this.scale);
        return [gridX, gridY]
    }

    /**
     * Verifica se la cella alle cordinate passate è occupata da un 
     * banco o no. Se viene passato anche l'orientamento verifica anche se  
     * la cella adiacente è occupata.
     */
    private isBusy = (x: number, y: number, orientation?: Orientation): boolean => {
        // funzione che controlla se una singola cella (i,j) è occupata 
        const b = (i: number, j: number): boolean => {
            for (const desk of this.desks) {
                if ((desk.x1 === i && desk.y1 === j) || (desk.x2 === i && desk.y2 === j))
                    return true;
            }
            return false;
        }

        //  VERIFICA SOLTANTO SE LA SINGOLA CELLA E' OCCUPATA
        if (orientation === null || orientation === undefined) return b(x, y);
        //  VERIFICA  SE LA CELLA O LA SUA ADIACENTE SONO OCCUPATE
        else {
            if (!b(x, y)) { // verifica se la prima cella è occupata 
                // verifica se la seconda cella (adiacente alla prima) è occupata
                if (orientation === Orientation.E) return b(x + 1, y);
                else if (orientation === Orientation.W) return b(x - 1, y);
                else if (orientation === Orientation.S) return b(x, y + 1);
                else if (orientation === Orientation.N) return b(x, y - 1);
            }
            return true;
        }
    }

    /**
     * Restituisce l'index del banco alle coordinate passate
     */
    private getDeskIndexByCoords = (x: number, y: number): number | null => {
        for (const [index, desk] of this.desks.entries()) {
            if ((desk.x1 === x && desk.y1 === y) || (desk.x2 === x && desk.y2 === y))
                return index;
        }
        return null;
    }

    /**
     * Aggiunge un banco
     */
    private addDesk = (x: number, y: number) => {
        let { orientation } = this.state;
        const recommendedOrientation = this.state.recommendedOrientation.value;
        if (recommendedOrientation != null) orientation = recommendedOrientation;
        // controlla se è stato impostato un numero massimo possibile di banchi
        if (this.props.maxDesks && this.props.maxDesks === this.desks.length) return;

        if (!this.isBusy(x, y, orientation)) {
            // aggiorna la cronologia 
            this.desksHistory.push([...this.desks]);
            // aggiunge il banco
            this.desks.push(new Desk(x, y, orientation));
        }

        // callback
        this.callback();
    }

    /**
     * Rimuove un banco
     */
    private removeDesk = (x: number, y: number) => {

        for (const index in this.desks) {
            if ((this.desks[index].x1 === x && this.desks[index].y1 === y) ||
                (this.desks[index].x2 === x && this.desks[index].y2 === y)) {
                // aggiorna la cronologia
                this.desksHistory.push([...this.desks]);
                // elimina il banco
                this.desks.splice(Number(index), 1);
            }
        }
        // aggiorna il client
        this.callback();
    }

    /**
     * Evidenzia il banco alla posizione passata
     */
    private highlightDesk = (x: number, y: number) => {
        const desk = this.getDeskIndexByCoords(x, y);
        if (desk === null) return;
        // Se il banco era già selezionato viene deselezionato
        const highlightedDesk = desk !== this.highlightedDesk ? desk : null
        this.highlightedDesk = highlightedDesk;
        // chaiama la funzione se passata dal client
        if (typeof this.props.onDeskIsHighlighted === "function")
            this.props.onDeskIsHighlighted(highlightedDesk);
    }

    /**
     * Rimuove tutti i banchi
     */
    private delateAll = () => {
        this.desksHistory.push([...this.desks]);
        this.desks = [];
        this.callback();
    }

    /**
     * Applica uo zoom secondo la proprietà passata dallo slider
     */
    private changeZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        this.setState({ zoom: value });
        this.scale = this.defaultScale * Number(value);
    }

    /**
     * Evidenzia l'area in cui può essere piazzato un banco
     */
    private highlightCursor = () => {
        if ((this.state.tool === ToolType.ADD && this.props.maxDesks !== this.desks.length) ||
            this.state.tool === ToolType.REMOVE) {
            const [x, y] = this.mouse.getMousePosition(RSType.GRID);
            let { orientation } = this.state;
            const recommendedOrientation = this.state.recommendedOrientation.value;
            if (recommendedOrientation != null) orientation = recommendedOrientation;
            if (x && y) {
                // funzione vera e propria 
                const f = (o: Orientation) => {
                    this.ctx.save();
                    this.ctx.strokeStyle = "yellow";
                    this.ctx.shadowColor = "yellow";
                    this.ctx.shadowBlur = 5;
                    this.ctx.lineWidth = 0.01;

                    if (o === Orientation.E) this.ctx.strokeRect(x, y, 2, 1);
                    else if (o === Orientation.S) this.ctx.strokeRect(x, y, 1, 2);
                    else if (o === Orientation.W) this.ctx.strokeRect(x - 1, y, 2, 1);
                    else if (o === Orientation.N) this.ctx.strokeRect(x, y - 1, 1, 2);
                    this.ctx.restore();
                }
                // controlla se non ci sono già dei banchi
                if (!this.isBusy(x, y, orientation)) {
                    f(orientation);
                } else {
                    // Propone un suggerimento
                    if (orientation === Orientation.E && !this.isBusy(x, y, Orientation.W))
                        this.setState({ recommendedOrientation: { value: Orientation.W, cell: [x, y] } })
                    else if (orientation === Orientation.W && !this.isBusy(x, y, Orientation.E))
                        this.setState({ recommendedOrientation: { value: Orientation.E, cell: [x, y] } })
                    else if (orientation === Orientation.N && !this.isBusy(x, y, Orientation.S))
                        this.setState({ recommendedOrientation: { value: Orientation.S, cell: [x, y] } })
                    else if (orientation === Orientation.S && !this.isBusy(x, y, Orientation.N))
                        this.setState({ recommendedOrientation: { value: Orientation.N, cell: [x, y] } })
                }
            }
        }
    }

    /**
     * Disegna la griglia
     */
    private renderGrid = () => {
        const { width, height } = this.state;
        if (!width || !height) return;
        this.ctx.beginPath();
        for (let i = 0; i < width / this.scale; i++) {
            this.ctx.moveTo(i * this.scale, 0);
            this.ctx.lineTo(i * this.scale, height);
        }
        for (let i = 0; i < height / (this.scale); i++) {
            this.ctx.moveTo(0, i * this.scale);
            this.ctx.lineTo(width, i * this.scale);
        }
        this.ctx.lineWidth = 0.05;
        this.ctx.strokeStyle = "#000";
        this.ctx.stroke();
    }


    /**
     * Pulisce e disegna lo sfondo
     */
    private drawBackground = () => {
        if (!this.state.width && !this.state.height) return;
        // pulisce lo sfondo
        this.ctx.clearRect(0, 0, this.state.width, this.state.height);
        // colora lo sofndo se è stato passato un colore
        if (this.props.style && this.props.style.backgroundColor) {
            this.ctx.fillStyle = this.props.style.backgroundColor;
            this.ctx.fillRect(0, 0, this.state.width, this.state.height);
        }
        // disegna la griglia 
        if (!this.props.notEditable) this.renderGrid();
    }

    private tick = () => {
        // disegna lo sfondo
        this.drawBackground();
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        // evidenzia la zona in cui può essere piazzato un banco
        this.highlightCursor();
        // disegna i banchi
        const { style } = this.props;
        for (let i = 0; i < this.desks.length; i++) {
            const isHighlighted = this.highlightedDesk === i;
            this.desks[i].render(this.ctx, { isHighlighted, style });
        }
        this.ctx.restore();

        requestAnimationFrame(this.tick);
    }
}

export default ClassRoomMap;