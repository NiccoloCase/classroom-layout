import * as React from "react";
import classnames from "classnames";
import { DotLoader } from 'react-spinners';
import { DeskInput, Classroom, MutationEditClassroomArgs, Omit } from '../../../../generated/graphql';
import { ClassRoomMap, /* Desk */ } from '../../../../components/ClassRoomMap';
import { TabsEditsErrors } from '.';

interface EditMapTabProps {
    /** Classe */
    classroom: Classroom;
    /** Modifiche */
    edits: MutationEditClassroomArgs;
    /** Funzione che manda al componente parente le modifiche apportate */
    sendEdits: (edits: Omit<MutationEditClassroomArgs, "id">, errors?: TabsEditsErrors | boolean) => void;
}

export const EditMapTab: React.FC<EditMapTabProps> = ({ classroom, sendEdits, edits }) => {
    // contenitore del canvas
    const canvasWrapper = React.useRef<HTMLDivElement>(null);
    // dimensioni canvas 
    const [canvasDims, setCanvasDims] = React.useState<{ width: number, height: number }>();
    // numero di studenti
    const studentsNumber = edits.students ? edits.students.length : classroom.students.length;
    // banchi
    const desks = edits.desks || classroom.desks;

    // imposta le dimensioni corrette del canvas
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
     * Funzione chiamata ad ogni cambiamento dei banchi
     * @param desksRaw 
     */
    const handleDesksChanges = (desksRaw: DeskInput[]) => {
        if (desksRaw.length === studentsNumber)
            sendEdits({ desks: desksRaw }, false);
        else sendEdits({ desks: desksRaw }, true)
    }

    /**
     * Renderizza il messaggio informativo
     */
    const renderText = () => {
        const defaultText = `Hai disposto ${desks.length} banchi.`; // messaggio predefinito
        let error; // messaggio di errrore
        const diff = desks.length - studentsNumber;
        if (desks.length > studentsNumber)
            error = `Hai disposto ${Math.abs(diff)} banc${Math.abs(diff) === 1 ? "o" : "hi"} in più.`;
        else if (desks.length < studentsNumber)
            error = `Devi ancora disporre ${Math.abs(diff)} banc${Math.abs(diff) === 1 ? "o" : "hi"}.`;

        return (
            <p className={classnames("section-title", { error })}>
                {error ? error : defaultText}
            </p>
        );
    }

    return (
        <div className="edit-map-tab">
            <div className="top-section">
                {renderText()}
            </div>
            <div className="canvas-wrapper" ref={canvasWrapper}>
                {canvasDims ?
                    <ClassRoomMap
                        width={canvasDims!.width}
                        height={canvasDims!.height}
                        handleChanges={handleDesksChanges}
                        desks={desks}
                        maxDesks={studentsNumber}
                        disableAutofocus /> :
                    <DotLoader color="#dadfe1" />
                }
            </div>
        </div>
    );
}