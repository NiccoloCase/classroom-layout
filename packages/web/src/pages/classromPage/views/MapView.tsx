import * as React from "react";
import classnames from "classnames";
import { HashLoader } from 'react-spinners';
import ScrollContainer from "react-indiana-drag-scroll";
import { Spring } from "react-spring/renderprops.cjs"
import { ClassRoomMap } from '../../../components/ClassRoomMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { useShuffleDesksMutation, Classroom } from '../../../generated/graphql';
import { TitleComponent } from '../../../components/TitleComponent';
import { DownloadMapComponent } from '../../../components/DownloadMap';

interface MapViewProps {
    classroom: Classroom;
    /** Funzione chiamata quando gli studenti sono mescolati */
    onDesksAreShuffled: (shuffledStudents: string[]) => void;
}

export const MapView: React.FC<MapViewProps> = ({ classroom, onDesksAreShuffled }) => {
    // contenitore del canvas
    const canvasWrapper = React.useRef<HTMLDivElement>(null);
    // dimensioni canvas 
    const [canvasDims, setCanvasDims] = React.useState<{ width: number, height: number }>();
    // pop-up per scaricare la mappa
    const [isMapDownloadPopupOpen, setIsMapDownloadPopupOpen] = React.useState(false);
    // è la classe prefirita?
    const [isFavorite, setIsFavorite] =
        React.useState(localStorage.getItem("favorite-classroom-id") === classroom.id);
    // contenitore della lista degli studenti 
    const studentsSlider = React.createRef<ScrollContainer>();
    // studente selezionato 
    const [selectedStudent, setSelectedStudent] = React.useState<string | null>(null);
    // GRAPQHL
    const [shuffleMutation] = useShuffleDesksMutation({ variables: { id: classroom.id } });

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

    /** Mescola i banchi */
    const shuffleDesks = async () => {
        const { data } = await shuffleMutation();
        if (data)
            onDesksAreShuffled(data.shuffleDesks.students);
    }

    /**
     * Funzione che viene chiamata quando viene selezionato / deselezionato un banco
     * @param index 
     */
    const onDeskIsHighlighted = (index: number | null) => {
        if (!classroom) return;
        const { students } = classroom;
        const slider = studentsSlider.current;

        if (index !== null && students && slider) {
            const student = students[index];
            setSelectedStudent(student);
            // Scorre la lista degli alunni fino allo studente selezionato
            const wrapper = slider.getElement();
            const i = [...students].sort().indexOf(student);
            const item = wrapper.childNodes[i] as HTMLElement;
            if (item) {
                const count = item.offsetTop - wrapper.scrollTop - 260;
                wrapper.scrollBy({ top: count, left: 0, behavior: 'smooth' })
            }
        }
        else setSelectedStudent(null)
    }

    /**
     * Imposta / rimuove la classe come preferita
     */
    const changeClassFavoriteState = () => {
        // salva l'id della classe nello storage
        if (!isFavorite) localStorage.setItem("favorite-classroom-id", classroom.id);
        // rimove la classe 
        else localStorage.removeItem("favorite-classroom-id");
        // aggiorna lo stato
        setIsFavorite(!isFavorite);
    }

    /**
     * Disegna il riquadro degli studenti
     */
    const renderStudents = (students: string[]) => {
        const selectStudent = (student: string) => {
            if (selectedStudent !== student) setSelectedStudent(student)
            else setSelectedStudent(null)
        }

        const cards = [...students].sort().map((student, index) => (
            <button
                className={classnames("student", { active: selectedStudent === student })}
                onClick={() => selectStudent(student)} key={index}>
                <div className="thumbnail" >
                    {student[0] + student[1]}
                </div>
                <p>{student}</p>
            </button>
        ));
        return (
            <div className="students">
                <h4 className="section-title">{students.length} studenti:</h4>
                <ScrollContainer className="students-container" horizontal={false} ref={studentsSlider}>
                    {cards}
                </ScrollContainer>
            </div>
        );
    }

    return (
        <div className="ClassroomPage__MapView">
            <div className="left-section">
                <TitleComponent title="Gestisci la tua classe" />
                <h3 className="title">Piantina della tua classe:</h3>
                {isMapDownloadPopupOpen &&
                    <DownloadMapComponent desks={classroom.desks} students={classroom.students}
                        popupHasClosed={() => setIsMapDownloadPopupOpen(!isMapDownloadPopupOpen)} />}
                <div className="card">
                    <div className="canvas-wrapper" ref={canvasWrapper}>
                        {canvasDims ?
                            <ClassRoomMap
                                width={canvasDims.width}
                                height={canvasDims.height}
                                students={classroom.students}
                                desks={classroom.desks} notEditable
                                onDeskIsHighlighted={onDeskIsHighlighted}
                                highlightedDesk={selectedStudent ?
                                    classroom.students.indexOf(selectedStudent) : undefined} /> :
                            <HashLoader color="#dadfe1" />
                        }
                    </div>
                    <div className="functions">
                        <button className="btn" title="Scarica la mappa dei posti"
                            onClick={() => setIsMapDownloadPopupOpen(!isMapDownloadPopupOpen)}>
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <button className="btn" title="Cambia i posti" onClick={shuffleDesks}>
                            <FontAwesomeIcon icon={faRandom} />
                        </button>
                    </div>
                </div>
            </div>
            {/* MENU LATERALE DI DESTRA */}
            <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
                {props => (
                    <div className="right-section" style={props}>
                        <div className="classroom-info" >
                            <span className="classroom-info__title">
                                <FontAwesomeIcon
                                    title={isFavorite ? "Rimuovi la classe come preferita" : "Imposta la classe come preferita"}
                                    icon={isFavorite ? faStar : faStarOutline} onClick={changeClassFavoriteState} />
                                <h2>Classe</h2>
                            </span>
                            <h3 className="classroom-info__name">{classroom.name}</h3>
                            <h4 className="classroom-info__id">{`#${classroom.id}`}</h4>
                        </div>
                        {renderStudents(classroom.students)}
                    </div>)}
            </Spring>
        </div>
    );
}
