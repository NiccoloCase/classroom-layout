import * as React from 'react';
const { useState, useRef, useEffect } = React;
import classnames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory, faCog, faMap } from '@fortawesome/free-solid-svg-icons';
import "./classroomPage.scss";
import { Route, NavLink, RouteComponentProps } from "react-router-dom";
import { MapView } from './views/MapView';
import EditView from './views/EditView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { useGetClassroomByIdQuery, Classroom, Desk } from "../../generated/graphql"
import { HashLoader } from 'react-spinners';
import { NotFoundView } from '../../components/NotFound';

interface IParams { class_id: string };

export const ClassroomPage: React.FC<RouteComponentProps<IParams>> = props => {
    // dimensioni del canvas
    const [canvasDimensions, setCanvasDimensions] = useState<{ width?: number, height?: number }>({});
    // studente selezionato 
    const [selectedStudent, setSelectedStudent] = React.useState<string | null>(null);
    // classe
    const [classroom, setClassroom] = React.useState<Classroom | undefined>(undefined);
    // contenitore 
    const [contentContainer, setContentContainer] = useState<HTMLDivElement | null>(null);
    const contentContainerRef = (node: HTMLDivElement) => {
        if (node !== null) setContentContainer(node);
    }
    // lista degli studenti 
    const studentsContainer = useRef<HTMLDivElement>(null);
    // GRAPHQL
    const id = props.match.params.class_id;
    const { loading, error, data } = useGetClassroomByIdQuery({ variables: { id } });

    useEffect(() => {
        if (data) setClassroom(data.getClassroomById as Classroom | undefined);
    }, [data]);

    useEffect(() => {
        setClassroomDimensions();
        window.addEventListener('resize', setClassroomDimensions);
        return () => window.removeEventListener('resize', setClassroomDimensions);
    }, [contentContainer])

    /**
     * Imposta le dimensioni del canvas
     */
    const setClassroomDimensions = () => {
        if (!contentContainer) return;
        const { width, height } = contentContainer.getBoundingClientRect();
        const offset = 130;
        setCanvasDimensions({ width: width - offset, height: height - offset });
    }

    /**
     * Funzione che viene chiamata quando viene selezionato / deselezionato un banco
     * @param index 
     */
    const onDeskIsHighlighted = (index: number | null) => {
        if (!classroom) return;
        const students = classroom.students;

        if (index != null && students && studentsContainer.current) {
            const student = students[index];
            setSelectedStudent(student);
            // Sccorre la lista degli alunni fino allo studente selezionato
            const wrapper = studentsContainer.current;
            const i = [...students].sort().indexOf(student);
            const item = wrapper.childNodes[i] as HTMLElement;
            if (item) {
                const count = item.offsetTop - wrapper.scrollTop - 260;
                wrapper.scrollBy({ top: count, left: 0, behavior: 'smooth' })
            }
        }
        else setSelectedStudent(null)
    }

    const onDesksAreShuffled = (shuffledStudents: string[]) => {
        if (!classroom) return;
        const newClassroom = { ...classroom }
        newClassroom.students = shuffledStudents;
        setClassroom(newClassroom);

    }

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
                <div className="students-container" ref={studentsContainer}>
                    {cards}
                </div>
            </div>
        );
    }


    /**
     * Schermata principale
     */
    const renderMainView = ({ name, students, desks }: Classroom) => (
        <React.Fragment>
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
            <div className="content" ref={contentContainerRef}>
                <Route path="/:class_id" exact component={() => (
                    <MapView
                        classId={id}
                        desks={desks} students={students}
                        canvasWidth={canvasDimensions.width}
                        canvasHeight={canvasDimensions.height}
                        highlightedDesk={selectedStudent ? students.indexOf(selectedStudent) : undefined}
                        onDeskIsHighlighted={onDeskIsHighlighted}
                        onDesksAreShuffled={onDesksAreShuffled}
                    />)} />
                <Route path="/:class_id/edit" exact component={() =>
                    <EditView
                        classId={id}
                        desks={desks} students={students}
                        canvasWidth={canvasDimensions.width}
                        canvasHeight={canvasDimensions.height}
                        onSave={onDesksAreUpdated}
                    />}
                />
                <Route path="/:class_id/history" exact component={HistoryView} />
                <Route path="/:class_id/settings" exact component={SettingsView} />
            </div>
            <div className="right-menu">
                <div className="classroom-info">
                    <h2>CLASSE</h2>
                    <h3 className="classroom-name">{name}</h3>
                    <h4 className="classroom-id">{`#${id}`}</h4>
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
