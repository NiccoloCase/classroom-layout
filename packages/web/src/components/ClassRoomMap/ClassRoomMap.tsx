import * as React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMousePointer, faEraser, faTrash, faSearchPlus, faSearchMinus, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import Popup from "reactjs-popup";
import * as styles from "./DrawLayout.module.scss";
import { ToolType, ReferenceSystemType as RSType, Orientation } from './enums';
import { Mouse } from './Mouse';
import { Desk } from "./Desk";

interface ClassRoomMapProps {
    /** Larghezza del canvas */
    width: number;
    /** Altezza del canvas */
    height: number;
    /** NUmero massimo di banchi */
    maxDesks?: number;
    /** Se la configurazione non è modificabile */
    notEditable?: boolean;
    /** Banchi in formato JSON */
    desks?: string;
    /** Dimnesione delle celle */
    scale?: number;
    /** Array di studenti */
    students?: string[];
    /**
     * Funzione chiamata ogni vole che avviene un cambiamento 
     * @param desks Array dei banchi in formato JSON
     */
    handleChanges?: (desks: string) => void;
}

class ClassRoomMap extends React.Component<ClassRoomMapProps> {
    // CANVAS
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    /** Banchi */
    desks: Desk[];
    /** Studenti */
    students?: string[];
    /** dimensione di una cela */
    scale: number;
    /** Intervallo di zoom */
    deltaZoom: number;
    /** Mouse */
    mouse: Mouse;

    state = {
        width: this.props.width as number | undefined,
        height: this.props.height as number | undefined,
        /** Strumento in uso */
        tool: this.props.notEditable ? ToolType.POINTER : ToolType.ADD,
        /** Orientamento con cui vengono posizionati i blocchi */
        orientation: Orientation.E,
        /** Orientamento non voluto dall'utente ma proposto a seconda della situazione */
        recommendedOrientation: {
            value: null as Orientation | null, // orientamento 
            cell: [] as number[] // cella in cui è avvenuto il suggerimento
        }
    }

    componentDidMount() {
        this.scale = this.props.scale || 35;
        this.deltaZoom = 5;
        this.students = this.props.students;
        this.ctx = this.canvas.getContext("2d")!;
        // EVENTI
        this.mouse = new Mouse();
        this.canvas.addEventListener("mousedown", this.onMouseClick);
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        // BANCHI
        this.desks = this.props.desks ? Desk.jsonToDesks(this.props.desks) : [];
        if (this.students) Desk.setNames(this.desks, this.students);
        // chaiama la funzione se passata tra le proprietà
        this.callback();
        // AVVIA IL LOOP
        this.tick();
    }

    UNSAFE_componentWillReceiveProps({ width, height, students }: ClassRoomMapProps) {
        if (width) this.setState({ width });
        if (height) this.setState({ height });
        if (students) {
            this.students = students;
            Desk.setNames(this.desks, this.students);
        }
    }

    render() {
        return (
            <div>
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
            <button onClick={() => this.switchTool(ToolType.POINTER)} className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.POINTER })}>
                <FontAwesomeIcon icon={faMousePointer} />
            </button>
            <button onClick={() => this.switchTool(ToolType.ADD)} className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.ADD })}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={() => this.switchTool(ToolType.REMOVE)} className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.REMOVE })} >
                <FontAwesomeIcon icon={faEraser} />
            </button>
            <div className={styles.actions}>
                <button onClick={() => this.swtichOrientation()} className={styles.action}>
                    <FontAwesomeIcon icon={faSyncAlt} />
                </button>
                <button onClick={this.zoomIn} className={styles.action}>
                    <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button onClick={this.zoomOut} className={styles.action}>
                    <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                {/*TRASH CAN*/}
                <Popup trigger={
                    <button className={styles.action}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>} closeOnDocumentClick position="bottom center">
                    {close => (<div className={styles.popUp}>
                        <div className={styles.left}>
                            <div>Sei sicuro di volere cancellare tutti i banchi?</div>
                            <button onClick={() => { this.delateAll(); close(); }}>Cancella</button>
                        </div>
                        <div className={styles.right}>
                            <button><FontAwesomeIcon icon={faTimes} onClick={close} /></button>
                        </div>
                    </div>)}
                </Popup>
            </div>
        </div>);

    /**
     * Chaiama la funzione passata tra le proprietà 
     */
    private callback = () => {
        // verifica se la funzione è stata passata tra le proprietà
        if (typeof this.props.handleChanges === "function")
            this.props.handleChanges(this.desksToJSON());
    }

    /**
     * Cambia il tipo di strumento selezionato
     */
    private switchTool = (tool: ToolType) => {
        this.setState({ tool });
    }

    /**
     * Converte i banche in formato JSON
     */
    private desksToJSON = (): string => {
        const objs = this.desks.map(desk => desk.object);
        return JSON.stringify(objs);
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
     * Aggiunge un banco
     */
    private addDesk = (x: number, y: number) => {
        let { orientation } = this.state;
        const recommendedOrientation = this.state.recommendedOrientation.value;
        if (recommendedOrientation != null) orientation = recommendedOrientation;
        // controlla se è stato impostato un numero massimo possibile di banchi
        if (this.props.maxDesks && this.props.maxDesks === this.desks.length) return;
        // aggiunge il banco
        if (!this.isBusy(x, y, orientation))
            this.desks.push(new Desk(x, y, orientation));
        // callback
        this.callback();
    }

    /**
     * Rimuove un banco
     */
    private removeDesk = (x: number, y: number) => {
        for (const index in this.desks) {
            if ((this.desks[index].x1 === x && this.desks[index].y1 === y) ||
                (this.desks[index].x2 === x && this.desks[index].y2 === y))
                this.desks.splice(Number(index), 1);
        }
        // aggiorna il client
        this.callback();
    }

    /**
     * Rimuove tutti i banchi
     */
    private delateAll = () => {
        this.desks = [];
        this.callback();
    }

    private zoomIn = () => this.scale += this.deltaZoom;

    private zoomOut = () => {
        if (this.scale - this.deltaZoom > 0)
            this.scale -= this.deltaZoom;
    }

    /**
     * Evidenzia l'area in cui può essere piazzato un banco
     */
    private highlightCursor = () => {
        if (this.state.tool === ToolType.ADD) {
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
        this.ctx.lineWidth = 0.1;
        this.ctx.strokeStyle = "#000";
        this.ctx.stroke();
    }


    /**
     * Pulisce lo sfondo
     */
    private clearBackground = () => {
        this.ctx.clearRect(0, 0, this.state.width!, this.state.height!);
    }

    private tick = () => {
        this.renderGrid();  // disegna la griglia 
        this.clearBackground(); // pulisce lo sfondo

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.highlightCursor(); // evidenzia la zona in cui può essere piazzato un banco
        // disegna i banchi
        for (const desk of this.desks) {
            // console.log(desk.x, desk.y)
            desk.render(this.ctx);


        }
        this.ctx.restore();
        requestAnimationFrame(this.tick);
    }
}

export default ClassRoomMap;