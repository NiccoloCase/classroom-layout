import * as React from "react";
import _ from "lodash";
import { TitleComponent } from '../../../components/TitleComponent';
import { HashLoader } from '../../../../../../node_modules/react-spinners';
import { ClassRoomMap, ToolType, Desk } from '../../../components/ClassRoomMap';
import { Classroom, DeskInput, useEditClassroomMutation } from '../../../generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';

interface ShuffleViewProps {
    classroom: Classroom;
    /** Funzione chiamata quando gli studenti sono mescolati */
    onDesksAreShuffled: (shuffledData: { students?: string[], desks?: DeskInput[] }) => void;
}

export const ShuffleView: React.FC<ShuffleViewProps> = ({ classroom, onDesksAreShuffled }) => {
    // contenitore del canvas
    const canvasWrapper = React.useRef<HTMLDivElement>(null);
    // dimensioni canvas 
    const [canvasDims, setCanvasDims] = React.useState<{ width: number, height: number }>();
    // banchi
    const [desks, setDesks] = React.useState<DeskInput[]>(classroom.desks);
    // GRAPHQL
    const [editClassroom] = useEditClassroomMutation();

    React.useEffect(() => {
        const resizeListener = () => {
            if (!canvasWrapper || !canvasWrapper.current) return;
            const { width, height } = canvasWrapper.current.getBoundingClientRect();
            setCanvasDims({ width, height });
        }
        resizeListener();
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, []);

    /**
     * Salva le modfiche apportate alla disposizione degli studenti 
     */
    const saveChanges = async () => {
        if (desks) {
            const translatedDesks = Desk.desksToObjs(Desk.centerDesks(desks));
            const { data } = await editClassroom({ variables: { id: classroom.id, desks: translatedDesks } });
            if (data) onDesksAreShuffled({ desks: translatedDesks });
            classroom.desks = translatedDesks as any;
        }
    }

    /**
     * Funzione che verifica se sono state apportate delle modifiche nell'ordine dei banchi
     */
    const haveThereBeenChanges = (): boolean => desks !== classroom.desks;

    return (
        <div className="ClassroomPage__ShuffleView">
            <TitleComponent title="Mescola gli studenti" />
            <h3 className="title">Mescola gli studenti</h3>
            <div className="card">
                <div className="buttons">
                    <button className="shuffle-btn" onClick={() => setDesks(_.shuffle(desks))}>
                        <span>Mescola casualmente</span>
                    </button>
                    <button className="save-btn" disabled={!haveThereBeenChanges()} onClick={saveChanges}>
                        <FontAwesomeIcon icon={faSave} />
                        <span>Salva le modifiche</span>
                    </button>
                    <button className="restore-btn" disabled={!haveThereBeenChanges()}
                        onClick={() => setDesks(classroom.desks)}>
                        <FontAwesomeIcon icon={faUndo} />
                        <span>Ripristina</span>
                    </button>
                </div>
                <div className="map-wrapper">
                    <span className="info-text">
                        Cambia la collocazione degli studenti manualmente
                        <Popup closeOnDocumentClick position="bottom center" on="hover"
                            trigger={<span><FontAwesomeIcon icon={faInfoCircle} /></span>}>
                            {() => (
                                <div className="info-popup">
                                    <h4>Per scambiare due studenti:</h4>
                                    <p>Selezionare il banco dello studente del quale si vuole cambiare la posizione e trascinare la freccia che si forma sul banco associato all'altro studente da scambiare</p>
                                </div>)}
                        </Popup>
                    </span>
                    <div className="canvas-wrapper" ref={canvasWrapper}>
                        {canvasDims ?
                            <ClassRoomMap
                                width={canvasDims.width} height={canvasDims.height}
                                students={classroom.students} desks={desks}
                                handleChanges={setDesks}
                                tool={ToolType.SWAP} notShowTools /> :
                            <HashLoader color="#dadfe1" />}
                    </div>
                </div>
            </div>
        </div>
    );
}