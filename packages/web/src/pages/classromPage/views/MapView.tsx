import * as React from "react";
import { HashLoader } from 'react-spinners';
import { ClassRoomMap } from '../../../components/ClassRoomMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faDownload } from '@fortawesome/free-solid-svg-icons';
import { DeskInput, useShuffleDesksMutation } from '../../../generated/graphql';
import { TitleComponent } from '../../../components/TitleComponent';

interface MapViewProps {
    classId: string;
    students: string[];
    desks: DeskInput[];
    highlightedDesk?: number;
    /** Funzione chiamata quando un banco viene selezionato / deselezionato */
    onDeskIsHighlighted?: (index: number | null) => void;
    /** Funzione chiamata quando i banchi vengono mischiati */
    onDesksAreShuffled: (shuffledStudents: string[]) => void;
}

export const MapView: React.FC<MapViewProps> = props => {
    // contenitore del canvas
    const canvasWrapper = React.useRef<HTMLDivElement>(null);
    // dimensioni canvas 
    const [canvasDims, setCanvasDims] = React.useState<{ width: number, height: number }>();
    // GRAPQHL
    const [shuffleMutation] = useShuffleDesksMutation({ variables: { id: props.classId } });

    React.useEffect(() => {
        const resizeListener = () => {
            if (!canvasWrapper || !canvasWrapper.current) return;
            const { width, height } = canvasWrapper.current.getBoundingClientRect();
            setCanvasDims({ width, height });
        }
        resizeListener();
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, [])


    /**
     * Sacrica la piantina della classe
     */
    const downloadMap = () => {
        const canvas: HTMLCanvasElement | null = document.querySelector(".ClassroomPage__MapView canvas");
        if (!canvas) return;
        const dataURL = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');
        link.download = 'map.jpg';
        link.href = dataURL;
        link.click();
    }

    /** Mescola i banchi */
    const shuffleDesks = async () => {
        const { data } = await shuffleMutation();
        if (data)
            props.onDesksAreShuffled(data.shuffleDesks.students);
    }


    return (
        <div className="ClassroomPage__MapView">
            <TitleComponent title="Gestisci la tua classe" />
            <h3 className="title">Pianta della tua classe:</h3>
            <div className="card">
                <div className="canvas-wrapper" ref={canvasWrapper}>
                    {canvasDims ?
                        <ClassRoomMap
                            width={canvasDims.width}
                            height={canvasDims.height}
                            students={props.students}
                            highlightedDesk={props.highlightedDesk}
                            onDeskIsHighlighted={props.onDeskIsHighlighted}
                            desks={props.desks} notEditable /> :
                        <HashLoader color="#dadfe1" />
                    }
                </div>
                <div className="functions">
                    <button className="btn" title="Scarica la mappa dei posti" onClick={downloadMap}>
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button className="btn" title="Cambia i posti" onClick={shuffleDesks}>
                        <FontAwesomeIcon icon={faRandom} />
                    </button>
                </div>
            </div>
        </div >
    );
}
