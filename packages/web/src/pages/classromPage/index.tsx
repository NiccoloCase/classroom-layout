import * as React from 'react';
import classnames from "classnames";
import ScrollContainer from 'react-indiana-drag-scroll'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory, faCog, faMap, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import "./classroomPage.scss";
import { Route, NavLink, RouteComponentProps, Switch } from "react-router-dom";
import { MapView } from './views/MapView';
import EditView from './views/EditView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { useGetClassroomByIdQuery, Classroom, Desk, DeskInput } from "../../generated/graphql"
import { HashLoader } from 'react-spinners';
import { NotFoundView } from '../../components/NotFound';

interface IParams { class_id: string };

export const ClassroomPage: React.FC<RouteComponentProps<IParams>> = props => {
    // studente selezionato 
    const [selectedStudent, setSelectedStudent] = React.useState<string | null>(null);
    // classe
    const [classroom, setClassroom] = React.useState<Classroom | undefined>(undefined);
    // GRAPHQL
    const id = props.match.params.class_id;
    const { loading, error, data } = useGetClassroomByIdQuery({ variables: { id } });
    // è la classe prefirita?
    const [isFavorite, setIsFavorite] = React.useState(localStorage.getItem("favorite-classroom-id") === id);
    // contenitore della lista degli studenti 
    const studentsSlider = React.createRef<ScrollContainer>();

    // GRAOHQL
    React.useEffect(() => {
        if (data) setClassroom(data.getClassroomById as Classroom | undefined);
    }, [data]);

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
        if (!isFavorite) localStorage.setItem("favorite-classroom-id", id);
        // rimove la classe 
        else localStorage.removeItem("favorite-classroom-id");
        // aggiorna lo stato
        setIsFavorite(!isFavorite);
    }

    /**
     * Funzione che viene chimata a seguto del mescolamento dei banchi (studenti)
     */
    const onDesksAreShuffled = (shuffledStudents: string[]) => {
        if (!classroom) return;
        const newClassroom = { ...classroom }
        newClassroom.students = shuffledStudents;
        setClassroom(newClassroom);
    }

    /**
     * Funzione chimata quando l'array di banchi viene aggiornata
     * @param newDesks 
     */
    const onDesksAreUpdated = (newDesks: Desk[]) => {
        if (!classroom) return;
        const newClassroom = { ...classroom };
        newClassroom.desks = newDesks;
        setClassroom(newClassroom);
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

    /**
     * Schermate della navgazione interna 
     */
    const renderRoutes = (students: string[], desks: DeskInput[]) => (
        <Switch>
            <Route path="/:class_id" exact children={() => (
                <MapView
                    classId={id}
                    desks={desks} students={students}
                    highlightedDesk={selectedStudent ? students.indexOf(selectedStudent) : undefined}
                    onDeskIsHighlighted={onDeskIsHighlighted}
                    onDesksAreShuffled={onDesksAreShuffled}
                />)} />
            <Route path="/:class_id/edit" exact children={() =>
                <EditView classId={id} desks={desks} students={students} onSave={onDesksAreUpdated} />}
            />
            <Route path="/:class_id/history" exact children={HistoryView} />
            <Route path="/:class_id/settings" exact children={SettingsView} />
        </Switch>
    );

    /**
     * Schermata principale
     */
    const renderMainView = ({ name, students, desks }: Classroom) => (
        <React.Fragment>
            {/* MENU LATERALE DI SINISTRA */}
            <div className="left-menu">
                <div className="navLinks">
                    <NavLink to={`/${id}/`} exact className="navLink"
                        activeClassName="active"
                        title="Mappa della classe" >
                        <FontAwesomeIcon icon={faMap} />
                    </NavLink>
                    <NavLink to={`/${id}/edit`} exact className="navLink"
                        activeClassName="active" title="Modifica i posti">
                        <FontAwesomeIcon icon={faEdit} />
                    </NavLink>
                    <NavLink to={`/${id}/history`} exact className="navLink"
                        activeClassName="active" title="Cronologia">
                        <FontAwesomeIcon icon={faHistory} />
                    </NavLink>
                    <NavLink to={`/${id}/settings`} exact className="navLink"
                        activeClassName="active" title="Impostazioni">
                        <FontAwesomeIcon icon={faCog} />
                    </NavLink>
                </div>
            </div>
            {/* CONTENUTO */}
            <div className="content"> {renderRoutes(students, desks)} </div>
            {/* MENU LATERALE DI DESTRA */}
            <div className="right-menu">
                <div className="classroom-info" >
                    <span className="classroom-info__title">
                        <FontAwesomeIcon
                            title={isFavorite ? "Rimuovi la classe come preferita" : "Imposta la classe come preferita"}
                            icon={isFavorite ? faStar : faStarOutline} onClick={changeClassFavoriteState} />
                        <h2>Classe</h2>
                    </span>
                    <h3 className="classroom-info__name">{name}</h3>
                    <h4 className="classroom-info__id">{`#${id}`}</h4>
                </div>
                {renderStudents(students)}
            </div>
        </React.Fragment>
    );

    /**
     * Schermata in caso di errore
     */
    const renderErrorView = () => {
        if (!error) return;
        const err = error.graphQLErrors[0];
        // la classe non è stata trovata
        if (err && err.extensions && err.extensions.exception.status === 404)
            return (
                <div className="content">
                    <NotFoundView />
                </div>
            );
        // errore sconosciuto
        return (
            <div className="content">
                <h1>C'è stato un errore, riprova piu'tardi</h1>
            </div>
        );
    }

    /**
     * Schermata di caricamento
     */
    const loadingView = (
        <div className="content">
            <HashLoader color="#dadfe1" />
        </div>
    );

    const renderCorrectView = () => {
        if (error) return renderErrorView();
        else if (loading || !classroom) return loadingView;
        return renderMainView(classroom);
    }

    return (
        <div className="ClassroomPage">
            {renderCorrectView()}
        </div>
    );
}