import * as React from "react";
import { HashLoader } from 'react-spinners';
import { DeskInput, Classroom, MutationEditClassroomArgs } from '../../../../generated/graphql';
import { ClassRoomMap } from '../../../../components/ClassRoomMap';

interface EditMapTabProps {
    /** classe */
    classroom: Classroom;
    /** Funzione che richiede al server il salvataggio delle modifiche */
    saveEdits: (edits: MutationEditClassroomArgs) => void;
}


export const EditMapTab: React.FC<EditMapTabProps> = ({ classroom, saveEdits }) => {
    // contenitore del canvas
    const canvasWrapper = React.useRef<HTMLDivElement>(null);
    // dimensioni canvas 
    const [canvasDims, setCanvasDims] = React.useState<{ width: number, height: number }>();
    // banchi
    const [desks, setDesks] = React.useState(classroom.desks as DeskInput[]);


    React.useEffect(() => {
        const resizeListener = () => {
            if (!canvasWrapper || !canvasWrapper.current) return;
            const { width, height } = canvasWrapper.current.getBoundingClientRect();
            const offset = 50; // barra strumenti 
            setCanvasDims({ width, height: height - offset });
        }
        resizeListener();
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, [])


    /**
     *  Elimina le modifiche e riposta la vecchia configurazione
     */
    const restore = () => setDesks([...classroom.desks]);

    /**
     * Controlla se sono state apportate modifiche alla 
     * configurazione dei banchi o è rimasta invariata 
     */
    const hasSomethingChanged = (): boolean => {
        // elimina le proprità aggiunte da graphql
        const prevDesks = desks.map(map => ({ x: map.x, y: map.y, orientation: map.orientation }));
        const newDesks = classroom.desks.map(map => ({ x: map.x, y: map.y, orientation: map.orientation }))
        // Controlla se la nuova disposizione dei banchi è ugaule ala vecchia
        return JSON.stringify(prevDesks) !== JSON.stringify(newDesks);
    }

    /**
     * Controlla se la nuova configurazione è valida o no
     */
    const isValidConfiguration = (): boolean => {
        // controlla che la congigurazione non sia ugaule a quella precedente
        if (!hasSomethingChanged()) return false;
        // verifica che il numero di banchi sia uguale a quello di studenti
        else if (desks.length !== classroom.students.length) return false;
        else return true;
    }

    /**
     * Funzione chiamata al click del pulsante per salvare le modifiche
     */
    const handleSaveButton = () =>
        saveEdits({ id: classroom.id, desks })

    return (
        <div className="edit-map-tab">
            <div className="form" ref={canvasWrapper}>
                {canvasDims ?
                    <ClassRoomMap
                        width={canvasDims!.width}
                        height={canvasDims!.height}
                        handleChanges={setDesks}
                        desks={desks}
                        maxDesks={classroom.students.length}
                        disableAutofocus /> :
                    <HashLoader color="#dadfe1" />
                }
            </div>
            <div className="functions">
                <span className="desks-counter" title="Numero di banchi">
                    {`${desks.length}/${classroom.students.length}`}
                </span>
                <button className="btn" title="Ripristina la configurazione" onClick={restore}>
                    ripristina
            </button>
                <button className="btn" title="Salva le modifiche"
                    onClick={handleSaveButton} disabled={!isValidConfiguration()}>
                    salva
            </button>
            </div>
        </div>
    );
}