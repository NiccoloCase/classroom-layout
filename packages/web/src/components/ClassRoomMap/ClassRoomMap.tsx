import * as React from "react";
import classnames from "classnames";
import { isNil } from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMousePointer, faEraser, faTrash, faSearchPlus, faSyncAlt, faTimes, faUndoAlt, faCrosshairs, faSearchMinus, faCompress } from '@fortawesome/free-solid-svg-icons';
import Popup from "reactjs-popup";
import * as styles from "./DrawLayout.module.scss";
import { DeskInput } from '../../generated/graphql';
import { ToolType, ReferenceSystemType as RSType, Orientation } from './enums';
import { Mouse } from './Mouse';
import { Desk } from "./Desk";
import { IClassroomMapColors } from ".";

// Costanti
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.2

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
    /** Se non mostare gli strumenti (attivabile solo nel caso in cui la mappa sia modificabile) */
    notShowTools?: boolean;
    /** Se mostrare gli strumenti rapidi sopra il canvas */
    showFloatingButtons?: boolean;
    /** Banchi */
    desks?: DeskInput[];
    /** Banchi inizali */
    defaultDesks?: DeskInput[];
    /** Dimnesione delle celle */
    scale?: number;
    /** Array di studenti */
    students?: string[];
    /** Se i banchi sono selezionabili */
    highlightableDesks?: boolean;
    /** Index del banco evidenziato */
    highlightedDesk?: number;
    /** Disattiva la funzione che centra i banchi ad ogni loro cambiamento */
    disableAutofocus?: boolean;
    /** Stile */
    style?: IClassroomMapColors;
    /** Nome della classe HTML */
    className?: string;
    /** Strumento selezionato */
    tool?: ToolType;
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
    zoom: number;
    /** Se la schermata è in fullscreen */
    isFullscreen: boolean;
}

class ClassRoomMap extends React.Component<ClassRoomMapProps> {
    HTMLParent: HTMLDivElement;
    wrapper: HTMLDivElement;
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
    /** Banchi selezionati all'inzio e alla fine del trascinamento del mouse */
    drag: {
        initialDesk?: number | null;
        currentDesk?: number | null;
    } = {};
    /** Traslazione della visuale del canvas */
    panX: number = 0;
    panY: number = 0;

    constructor(props: ClassRoomMapProps) {
        super(props);
        // STATO
        this.state = {
            width: this.props.width,
            height: this.props.height,
            tool: this.props.tool || (this.props.notEditable ? ToolType.POINTER : ToolType.ADD),
            orientation: Orientation.E,
            recommendedOrientation: { value: null, cell: [] },
            zoom: 1,
            isFullscreen: false
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
        // AGGIUNGE GLI EVENTI
        if (!this.props.static) {
            // mouse
            this.mouse = new Mouse();
            this.canvas.addEventListener("mousedown", this.onMouseClick);
            this.canvas.addEventListener("mousemove", this.onMouseMove);
            window.addEventListener("mouseup", this.onMouseRelease);
            this.canvas.addEventListener("mousewheel", this.handleMouseWheel);
            this.canvas.addEventListener("DOMMouseScroll", this.handleMouseWheel);
            // touch
            this.canvas.addEventListener("touchstart", this.touchHandler, true);
            this.canvas.addEventListener("touchmove", this.touchHandler, true);
            this.canvas.addEventListener("touchend", this.touchHandler, true);
            this.canvas.addEventListener("touchcancel", this.touchHandler, true);
            // fullscreen
            this.HTMLParent.addEventListener('fullscreenchange', this.onFullscreenChange);
            this.HTMLParent.addEventListener('mozfullscreenchange', this.onFullscreenChange);
            this.HTMLParent.addEventListener('MSFullscreenChange', this.onFullscreenChange);
            this.HTMLParent.addEventListener('webkitfullscreenchange', this.onFullscreenChange);
        }

        // AVVIA IL LOOP
        this.tick();
    }

    componentWillUnmount() {
        // rimuove gli eventi
        // mouse
        this.canvas.removeEventListener("mousedown", this.onMouseClick);
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseRelease);
        this.canvas.removeEventListener("mousewheel", this.handleMouseWheel);
        this.canvas.removeEventListener("DOMMouseScroll", this.handleMouseWheel);
        // touch
        this.canvas.removeEventListener("touchstart", this.touchHandler);
        this.canvas.removeEventListener("touchmove", this.touchHandler);
        this.canvas.removeEventListener("touchend", this.touchHandler);
        this.canvas.removeEventListener("touchcancel", this.touchHandler);
        // fullscreen
        this.HTMLParent.removeEventListener('fullscreenchange', this.onFullscreenChange);
        this.HTMLParent.removeEventListener('mozfullscreenchange', this.onFullscreenChange);
        this.HTMLParent.removeEventListener('MSFullscreenChange', this.onFullscreenChange);
        this.HTMLParent.removeEventListener('webkitfullscreenchange', this.onFullscreenChange);
    }

    componentDidUpdate(prevProps: ClassRoomMapProps, prevState: ClassRoomMapState) {
        // VARIAZIONE NEI BANCHI
        if (this.props.desks) {
            const newDesks = [...this.props.desks];
            newDesks.forEach((d: any) => delete d.__typename);
            if (JSON.stringify(Desk.desksToObjs(this.desks)) !== JSON.stringify(newDesks)) {
                // controlla se deve centare i banchi
                if (!this.props.disableAutofocus) {
                    this.desks = Desk.centerDesks(newDesks);
                    // imposta la nuova scala
                    this.defaultScale = this.getScale(this.props.width, this.props.height, this.desks);
                    this.scale = this.defaultScale;
                }
                else this.desks = Desk.objsToDesks(newDesks);
                // associa gli studenti ai nuovi banchi 
                if (this.students) Desk.setNames(this.desks, this.students);
            }
        }

        // VARIAZIONE NEGLI STUDENTI 
        if (this.props.students !== this.students) {
            this.students = this.props.students;
            if (this.students) Desk.setNames(this.desks, this.students);
        }

        // VARIAZIONE DEL BANCO SELEZIONATO 
        if (this.highlightedDesk !== this.props.highlightedDesk)
            this.highlightedDesk = this.props.highlightedDesk;

        // VARIAZIONE DELLE DIMENSIONI
        if ((this.props.width !== prevState.width || this.props.height !== prevState.height) &&
            !this.state.isFullscreen) {
            // aggiorna le dimensioni
            this.setState({ width: this.props.width, height: this.props.height });
            // imposta la nuova scala
            this.defaultScale = this.getScale(this.props.width, this.props.height, this.desks);
            this.scale = this.defaultScale;
        }
    }

    render() {
        return (
            <div id="ClassroomMap" ref={e => (this.HTMLParent = e!)}
                className={classnames(this.props.className, styles.classroomMap)}>
                <div ref={e => (this.wrapper = e!)} className={styles.wrapper}>
                    {(!this.props.notEditable && !this.props.notShowTools) && this.drawTools()}
                    {this.props.showFloatingButtons && this.drawFloatingButtons()}
                    <canvas ref={e => (this.canvas = e!)} width={this.state.width} height={this.state.height} />
                </div>
            </div>
        );
    }

    /**
     * Disegna la barra degli strumenti
     */
    private drawTools = () => (
        <div className={styles.tools}>
            {/* Puntatore */}
            <button onClick={() => this.switchTool(ToolType.POINTER)} title="Puntatore"
                className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.POINTER })}>
                <FontAwesomeIcon icon={faMousePointer} />
            </button>
            {/* Strumento aggiungi */}
            <button onClick={() => this.switchTool(ToolType.ADD)} title="Aggiungi banchi"
                className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.ADD })}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
            {/* Strumento rimuovi */}
            <button title="Rimuovi banchi" onClick={() => this.switchTool(ToolType.REMOVE)}
                className={classnames(styles.tool, { [styles.active]: this.state.tool === ToolType.REMOVE })} >
                <FontAwesomeIcon icon={faEraser} />
            </button>
            <div className={styles.actions} title="Routa">
                {/* Orientamento banchi */}
                <button onClick={() => this.swtichOrientation()} className={styles.action}>
                    <FontAwesomeIcon icon={faSyncAlt} />
                </button>
                {/* Zoom */}
                <Popup trigger={
                    <button className={styles.action} title="Zoom">
                        <FontAwesomeIcon icon={faSearchPlus} />
                    </button>} closeOnDocumentClick position="bottom center">
                    <div className={styles.zoomPopUp}>
                        <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={0.1}
                            value={this.state.zoom} onChange={this.changeZoom} />
                    </div>
                </Popup>
                {/* Centra la visuale */}
                <button onClick={() => this.viewAllDesks()} className={styles.action}
                    title="Visualizza tutti i banchi">
                    <FontAwesomeIcon icon={faCrosshairs} />
                </button>
                {/* Mette a schermo intero */}
                <button onClick={this.toggleFullScreen} className={styles.action}
                    title={this.state.isFullscreen ? "Esci dallo schermo intero" : "Schermo intero"}>
                    <FontAwesomeIcon icon={faCompress} />
                </button>
                {/* Cestino */}
                <Popup trigger={
                    <button className={styles.action} title="Elimina tutti i banchi">
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
                    title="Torna indietro" disabled={this.desksHistory.length < 1}>
                    <FontAwesomeIcon icon={faUndoAlt} />
                </button>
            </div>
        </div>);

    /**
     * Disegna dei pulasnti al di sopra del canvas
     */
    private drawFloatingButtons = () => (
        <div className={styles.floatingButtons}>
            <button title="Centra la visuale" onClick={() => this.viewAllDesks()}>
                <FontAwesomeIcon icon={faCrosshairs} />
            </button>
            <button onClick={this.zoomIn}>
                <FontAwesomeIcon icon={faSearchPlus} />
            </button>
            <button onClick={this.zoomOut}>
                <FontAwesomeIcon icon={faSearchMinus} />
            </button>
            <button onClick={this.toggleFullScreen}
                title={this.state.isFullscreen ? "Esci dallo schermo intero" : "Schermo intero"}>
                <FontAwesomeIcon icon={faCompress} />
            </button>
        </div>
    );

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
    private switchTool = (tool: ToolType) =>
        this.setState({ tool });

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
     * Ripristina la visuale mettendo in mostra tutti i banchi
     * (Possono essere passati anche i valori della larghezza e dell'altezza del canvas, 
     * nel caso in cui lo stato non sia aggiornato)
     */
    private viewAllDesks = (width?: number, height?: number) => {
        // azzera la traslazione dei banchi
        this.panX = 0;
        this.panY = 0;
        // riprista lo zoom
        this.setState({ zoom: 1 });

        if (this.desks.length > 0) {
            // trasla i banchi
            this.desks = Desk.centerDesks(Desk.desksToObjs(this.desks));
            if (this.students && this.desks.length > 0) Desk.setNames(this.desks, this.students);
            // imposta lo zoom corretto 
            this.scale = this.getScale(width || this.state.width, height || this.state.height, this.desks);
        }
    }

    /**
     * Funzione chiamata quando la finestra entra o esce dallo schermo intero
     */
    private onFullscreenChange = () => {
        if ((document as any).webkitIsFullScreen ||
            (document as any).mozFullScreen ||
            (document as any).msFullscreenElement) {
            // schermo intero
            const { width, height: wrapperHeight } = this.wrapper.getBoundingClientRect();
            const offsetY = 50;
            const height = wrapperHeight -
                ((!this.props.notEditable && !this.props.notShowTools) ? offsetY : 0)
            this.canvas.width = width;
            this.canvas.height = height;
            this.setState({ width, height });
            this.viewAllDesks(width, height);
        }
        else {
            // Disattiva la modalità schermo intero
            const { width, height } = this.props;
            this.setState({ width, height });
            this.viewAllDesks(width, height);
            this.setState({ isFullscreen: false })
        }
    }

    /**
     * Attiva / disattiva la modalità schermo intero
     */
    private toggleFullScreen = () => {
        if (this.state.isFullscreen) document.exitFullscreen();
        else this.HTMLParent.requestFullscreen();
        this.setState({ isFullscreen: !this.state.isFullscreen })
    }

    /**
     * Funzione che gestisce gli eventi legati al touch trasformandoli in eventi 
     * del mouse
     * credit: https://stackoverflow.com/a/1781750/10117858
     */
    private touchHandler = (event: TouchEvent) => {
        const touches = event.changedTouches;
        const first = touches[0];
        let type = "";

        switch (event.type) {
            case "touchstart": type = "mousedown"; break;
            case "touchmove": type = "mousemove"; break;
            case "touchend": type = "mouseup"; break;
            default: return;
        }
        const simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, first.screenY,
            first.clientX, first.clientY, false,
            false, false, false, 0, null);

        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }

    /**
     * Funzione chiamata qundo viene usata la rotella del mouse 
     */
    private handleMouseWheel = (event: WheelEvent) => {
        if (event.deltaY < 0 || event.detail > 0) this.zoomIn();
        else this.zoomOut();
        event.preventDefault();
    }

    /**
     * Funzione chiamata quando viene cliccato il mouse all'interno del canvas
     */
    private onMouseClick = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX;
        const screenY = e.clientY;
        const canvasX = e.clientX - rect.left + this.panX * this.scale;
        const canvasY = e.clientY - rect.top + this.panY * this.scale;
        const [gridX, gridY] = this.switchToGridCoord(canvasX, canvasY);
        // Aggiorna i valori del mouse
        this.mouse.lastClickPosition = { canvasX, canvasY, gridX, gridY, screenX, screenY }
        this.mouse.mousePosition = { canvasX, canvasY, gridX, gridY, screenX, screenY }
        this.mouse.mouseHeld = true;

        // FUNZIONI
        if (this.state.tool === ToolType.POINTER && this.props.highlightableDesks)
            this.highlightDesk(gridX, gridY);
        else if (this.state.tool === ToolType.ADD) this.addDesk(gridX, gridY);
        else if (this.state.tool === ToolType.REMOVE) this.removeDesk(gridX, gridY);
        else if (this.state.tool === ToolType.SWAP)
            this.drag.initialDesk = this.getDeskIndexByCoords(gridX, gridY);
    }

    /**
     * Funzione chiamata al movimento del mouse
     */
    private onMouseMove = (e: MouseEvent) => {
        // AGGIORNA LA POSIZIONE DEL MOUSE
        // calcola la posizione attuale del mouse
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX;
        const screenY = e.clientY;
        const canvasX = e.clientX - rect.left + this.panX * this.scale;
        const canvasY = e.clientY - rect.top + this.panY * this.scale;
        const [gridX, gridY] = this.switchToGridCoord(canvasX, canvasY);
        // salva la vecchia posizione del mouse
        const [oldMouseX, oldMouseY] = this.mouse.getMousePosition(RSType.SCREEN);
        // Imposta la posizione attuale del mouse
        this.mouse.mousePosition = { canvasX, canvasY, gridX, gridY, screenX, screenY }

        // MUOVE LA VISUALE DEL CANVAS
        if (this.state.tool === ToolType.POINTER && this.mouse.mouseHeld &&
            !isNil(oldMouseX) && !isNil(oldMouseY)) {
            this.panX += oldMouseX / this.scale - screenX / this.scale;
            this.panY += oldMouseY / this.scale - screenY / this.scale;
        }

        // Imposta il cursore del mouse 
        this.setMouseCursor(gridX, gridY);

        // Se l'utente ha mosso il cursore dalla cella in cui era stato cambiata l'orientamento 
        // automaticamente come suggerimento, ripristina l'orinetamento originale
        if (this.state.recommendedOrientation.value != null && (this.state.recommendedOrientation.cell[0] !== gridX || this.state.recommendedOrientation.cell[1] !== gridY)) {
            this.setState({ recommendedOrientation: { value: null, cell: [] } });
        }

        // SWAP FUNCTION
        if (this.state.tool === ToolType.SWAP)
            this.drag.currentDesk = this.getDeskIndexByCoords(gridX, gridY);
    }

    /**
     * Funzione chiamata quando il mouse viene rilasciato 
     */
    private onMouseRelease = (e: MouseEvent) => {
        // imposta i valori attuali del mouse
        this.mouse.mouseHeld = false;

        // SWAP FUNCTION
        // scambia gli studenti
        const { initialDesk, currentDesk } = this.drag;
        if (!isNil(initialDesk)) {
            if (!isNil(currentDesk) && initialDesk !== currentDesk) this.swapStudents(initialDesk, currentDesk);
            this.drag.initialDesk = null;
            this.drag.currentDesk = null;
        }
    }

    /**
     * Scambia i banchi ai quali due studenti sono associati 
     * @param index1 Indice del primo banco 
     * @param index2 Indice del secondo banco 
     */
    private swapStudents(index1: number, index2: number) {
        if (this.students) {
            // per comodità scambia i banchi e non gli studenti 
            [this.desks[index1], this.desks[index2]] = [this.desks[index2], this.desks[index1]];
            Desk.setNames(this.desks, this.students);
            // avverte del cambiamento nei banchi
            this.callback();
        }
    }

    /**
     * Imposta il cursore del mouse più adeguato in base alla posizione del mouse
     */
    private setMouseCursor = (mouseX: number, mouseY: number) => {
        if (this.isBusy(mouseX, mouseY) && this.state.tool === ToolType.POINTER)
            this.canvas.style.cursor = "pointer";
        else if (this.state.tool === ToolType.POINTER)
            this.canvas.style.cursor = "move";
        else
            this.canvas.style.cursor = "default";
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
     * Applica uno zoom secondo la proprietà passata dallo slider
     */
    private changeZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        this.setState({ zoom: value });
        this.scale = this.defaultScale * Number(value);
    }

    /**
     * Aumenta lo zoom
     */
    private zoomIn = () => {
        let zoom = this.state.zoom * 1.1;
        // limita il valore 
        zoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
        this.setState({ zoom });
        this.scale = this.defaultScale * zoom;
    }

    /**
     * Diminuisce lo zoom
     */
    private zoomOut = () => {
        let zoom = this.state.zoom * 0.9;
        // limita il valore 
        zoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
        this.setState({ zoom });
        this.scale = this.defaultScale * zoom;
    }


    /**
     * Evidenzia l'area individuata con la posizione e l'orientameno passato
     */
    private highlightCell = (x: number, y: number, orientation: Orientation, color: string) => {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 5;
        this.ctx.lineWidth = 0.01;
        if (orientation === Orientation.E) this.ctx.strokeRect(x, y, 2, 1);
        else if (orientation === Orientation.S) this.ctx.strokeRect(x, y, 1, 2);
        else if (orientation === Orientation.W) this.ctx.strokeRect(x - 1, y, 2, 1);
        else if (orientation === Orientation.N) this.ctx.strokeRect(x, y - 1, 1, 2);
        this.ctx.restore();
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
            if (recommendedOrientation !== null) orientation = recommendedOrientation;
            if (!isNil(x) && !isNil(y)) {
                // controlla se non ci sono già dei banchi
                if (!this.isBusy(x, y, orientation)) {
                    this.highlightCell(x, y, orientation, "yellow");
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
     * Funzione che evidenzia i due banchi coinvolti nello scambio degli studenti a loro
     * associati 
     */
    private highlightDesksInvolvedInSwap = () => {
        const { initialDesk: initialDeskIndex, currentDesk: currentDeskIndex } = this.drag;

        if (this.state.tool === ToolType.SWAP) {
            if (!isNil(initialDeskIndex)) {
                // Evidenzia il banco de cui è partito il trascinamento del mouse
                const initialDesk = this.desks[initialDeskIndex];
                this.highlightCell(initialDesk.x1, initialDesk.y1, initialDesk.orientation, "red");

                if (!isNil(currentDeskIndex)) {
                    if (currentDeskIndex !== initialDeskIndex) {
                        // Evideniza il banco al passaggio del mouse
                        const currentDesk = this.desks[currentDeskIndex];
                        this.ctx.setLineDash([5 / this.scale, 3 / this.scale]);
                        this.highlightCell(currentDesk.x1, currentDesk.y1, currentDesk.orientation, "red");
                        this.ctx.setLineDash([]);
                        // Disegna una freccia che congiunge i banchi
                        this.ctx.strokeStyle = "#707070";
                        this.drawArrow(
                            (initialDesk.x1 + initialDesk.x2) / 2 + 0.5,
                            initialDesk.y1 - (initialDesk.y1 - initialDesk.y2) / 2 + 0.5,
                            (currentDesk.x1 + currentDesk.x2) / 2 + 0.5,
                            currentDesk.y1 - (currentDesk.y1 - currentDesk.y2) / 2 + 0.5,
                            0.1, 0.2
                        );
                    }
                }
                else {
                    // Disegna una freccia che congiunge il pirmo banco e il mpuse
                    const [x, y] = this.mouse.getMousePosition(RSType.CANVAS);
                    if (x && y) {
                        this.ctx.setLineDash([5 / this.scale, 3 / this.scale]);
                        this.ctx.strokeStyle = "#abb7b7";
                        this.drawArrow(
                            (initialDesk.x1 + initialDesk.x2) / 2 + 0.5,
                            initialDesk.y1 - (initialDesk.y1 - initialDesk.y2) / 2 + 0.5,
                            x / this.scale, y / this.scale, 0.1, 0.2
                        );
                    }
                }
            }
        }
    }

    /**
     * Disegna una linea che inizia e termina con una freccia 
     * Basato su: https://riptutorial.com/html5-canvas/example/18136/line-with-arrowheads
     * @param x0 Coordinata x di partenza della freccia 
     * @param y0 Coordinata y di partenza della freccia 
     * @param x1 Coordinata x di fine della freccia 
     * @param y1 Coordinata y di fine della freccia 
     * @param aWidth Apertura della freccia in larghezza
     * @param aLength Estensione della freccia in lunghezza 
     * @param arrowPosition Posizione della freccia 
     */
    private drawArrow = (x0: number, y0: number, x1: number, y1: number, aWidth: number, aLength: number, arrowPosition: "start" | "end" | "both" = "both") => {
        const dx = x1 - x0;
        const dy = y1 - y0;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);
        this.ctx.save();
        this.ctx.translate(x0, y0);
        this.ctx.rotate(angle);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(length, 0);
        if (arrowPosition === "start" || arrowPosition === "both") {
            this.ctx.moveTo(aLength, -aWidth);
            this.ctx.lineTo(0, 0);
            this.ctx.lineTo(aLength, aWidth);
        }
        if (arrowPosition === "end" || arrowPosition === "both") {
            this.ctx.moveTo(length - aLength, -aWidth);
            this.ctx.lineTo(length, 0);
            this.ctx.lineTo(length - aLength, aWidth);
        }
        this.ctx.stroke();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
    }

    /**
     * Disegna la griglia
     */
    private renderGrid = () => {
        const { width, height } = this.state;
        if (!width || !height) return;
        this.ctx.beginPath();

        // traslazione dei punti
        const offsetX = - this.panX * this.scale;
        const offsetY = - this.panY * this.scale;
        // traslazione della visuale
        const viewX = Math.floor(this.panX) * this.scale * 2;
        const viewY = Math.floor(this.panY) * this.scale * 2;

        for (let i = (viewX < 0 ? viewX : 0); i < width + (viewX > 0 ? viewX : 0); i += this.scale) {
            this.ctx.moveTo(i + offsetX, 0);
            this.ctx.lineTo(i + offsetX, height);
        }
        for (let i = (viewY < 0 ? viewY : 0); i < height + (viewY > 0 ? viewY : 0); i += this.scale) {
            this.ctx.moveTo(0, i + offsetY);
            this.ctx.lineTo(width, i + offsetY);
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
        this.ctx.translate(-this.panX * this.scale, -this.panY * this.scale);
        this.ctx.scale(this.scale, this.scale);
        // evidenzia la zona in cui può essere piazzato un banco
        this.highlightCursor();
        // disegna i banchi
        const { style } = this.props;

        for (let i = 0; i < this.desks.length; i++) {
            const desk = this.desks[i];
            // Renderizza il banco soltanto se si torva entro l'area visualizzata 
            if (Math.min(desk.x1, desk.x2) < this.state.width / this.scale + this.panX &&
                Math.max(desk.x1, desk.x2) + 1 > this.panX &&
                Math.min(desk.y1, desk.y2) < this.state.height / this.scale + this.panY &&
                Math.max(desk.y1, desk.y2) + 1 > this.panY
            ) {
                const isHighlighted = this.highlightedDesk === i;
                desk.render(this.ctx, {
                    style,
                    isHighlighted
                });
            }
        }

        // evidenzia i banchi coinvolti nello scambi di due studenti 
        this.highlightDesksInvolvedInSwap();
        this.ctx.restore();

        requestAnimationFrame(this.tick);
    }
}

export default ClassRoomMap;