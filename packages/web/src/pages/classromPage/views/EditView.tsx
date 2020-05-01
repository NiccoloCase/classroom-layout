import * as React from "react";
import { DeskInput, useEditClassroomMutation } from '../../../generated/graphql';
import { HashLoader } from 'react-spinners';
import { ClassRoomMap } from '../../../components/ClassRoomMap';
import { RouteComponentProps, withRouter } from "react-router-dom"
import { TitleComponent } from '../../../components/TitleComponent';

interface EditViewProps extends RouteComponentProps<any> {
    classId: string;
    students: string[];
    desks: DeskInput[];
    /** Funzione chiamata quando vengono salvate le modifiche */
    onSave: (desks: DeskInput[]) => void;
}

const EditView: React.FC<EditViewProps> = props => {
    // banchi
    const [desks, setDesks] = React.useState(props.desks);
    // contenitore del canvas
    const canvasWrapper = React.useRef<HTMLDivElement>(null);
    // dimensioni canvas 
    const [canvasDims, setCanvasDims] = React.useState<{ width: number, height: number }>();
    // GRAPHQL
    const [editClass] = useEditClassroomMutation()

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
    const restore = () => setDesks([...props.desks])

    /**
     * Salva le modifiche
     */
    const saveEdits = async () => {
        const { data } = await editClass({ variables: { id: props.classId, desks } });
        if (!data) return;
        props.onSave(data.editClassroom.desks);
        // ritona alla schermata principale
        props.history.push(`/${props.classId}`);
    }

    /**
     * Controlla se sono state apportate modifiche alla 
     * configurazione dei banchi o è rimasta invariata 
     */
    const hasSomethingChanged = (): boolean => {
        // elimina le proprità aggiunte da graphql
        const prevDesks = desks.map(map => ({ x: map.x, y: map.y, orientation: map.orientation }));
        const newDesks = props.desks.map(map => ({ x: map.x, y: map.y, orientation: map.orientation }))
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
        else if (desks.length !== props.students.length) return false;

        else return true;
    }

    return (
        <div className="ClassroomPage__EditView">
            <TitleComponent title="Modifica la tua classe" />
            <h3 className="title">Modifica la tua classe:</h3>
            <div className="card">
                <div className="canvas-wrapper" ref={canvasWrapper}>
                    {canvasDims ?
                        <ClassRoomMap
                            width={canvasDims.width}
                            height={canvasDims.height}
                            handleChanges={setDesks}
                            desks={desks}
                            maxDesks={props.students.length}
                            disableAutofocus /> :
                        <HashLoader color="#dadfe1" />
                    }
                </div>
                <div className="functions">
                    <span className="desks-counter" title="Numero di banchi">
                        {`${desks.length}/${props.students.length}`}
                    </span>
                    <button className="btn" title="Ripristina la configurazione" onClick={restore}>
                        ripristina
                </button>
                    <button className="btn" title="Salva le modifiche"
                        onClick={saveEdits} disabled={!isValidConfiguration()}>
                        salva
                </button>
                </div>
            </div>
        </div>
    );
}

export default withRouter(EditView);