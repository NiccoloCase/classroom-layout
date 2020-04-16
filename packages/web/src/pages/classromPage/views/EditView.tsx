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
    canvasWidth?: number;
    canvasHeight?: number;
    /** Funzione chiamata quando vengono salvate le modifiche */
    onSave: (desks: DeskInput[]) => void;
}

const EditView: React.FC<EditViewProps> = props => {
    const [desks, setDesks] = React.useState(props.desks);
    // GRAPHQL
    const [editClass] = useEditClassroomMutation()

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

    const content = (
        <React.Fragment>
            <ClassRoomMap
                width={props.canvasWidth!}
                height={props.canvasHeight!}
                handleChanges={setDesks}
                desks={desks} scale={55} maxDesks={props.students.length} />
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
        </React.Fragment>
    );

    return (
        <div className="ClassroomPage__EditView">
            <TitleComponent title="Modifica la tua classe" />
            {props.canvasWidth && props.canvasHeight ? content : <HashLoader color="#dadfe1" />}
        </div>
    );
}

export default withRouter(EditView);