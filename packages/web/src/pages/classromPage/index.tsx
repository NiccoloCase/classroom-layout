import * as React from 'react';
const { useState, useRef, useEffect } = React;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory, faCog, faMap } from '@fortawesome/free-solid-svg-icons';
import "./classroomPage.scss";
import { Route, NavLink } from "react-router-dom";
import { MapView } from './views/MapView';
import { EditView } from './views/EditView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';

const STUDENTS_TEST = ["Balidni", "Benucci", "Becagli", "Carifi", "Carone", "Caselli", "Cestelli", "Chini", "Ermini", "Ferradini", "Luti", "Superbi", "Cozzi", "Marzi", "Quaevedo", "Superbi", "Tafuro", "Surianello", "Tarchiani", "Cantini", "wd", "Quaevedo"];
const DESKS = '[{"x":0,"y":0,"orientation":1},{"x":2,"y":0,"orientation":1},{"x":4,"y":0,"orientation":1},{"x":6,"y":0,"orientation":1},{"x":0,"y":2,"orientation":1},{"x":2,"y":2,"orientation":1},{"x":4,"y":2,"orientation":1},{"x":0,"y":4,"orientation":1},{"x":2,"y":4,"orientation":1},{"x":4,"y":4,"orientation":1},{"x":16,"y":0,"orientation":1},{"x":14,"y":0,"orientation":1},{"x":12,"y":0,"orientation":1},{"x":16,"y":2,"orientation":1},{"x":14,"y":2,"orientation":1},{"x":10,"y":0,"orientation":1},{"x":12,"y":2,"orientation":1},{"x":16,"y":4,"orientation":1},{"x":14,"y":4,"orientation":1},{"x":12,"y":4,"orientation":1},{"x":16,"y":6,"orientation":1},{"x":14,"y":6,"orientation":0}]';
const ID = "87jskjskjdkjshds";

export const ClassroomPage: React.FC = () => {
    // dimensioni del canvas
    const [canvasDimensions, setCanvasDimensions] = useState<{ width?: number, height?: number }>({});
    // contrnitore 
    const contentContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setClassroomDimensions();
        window.addEventListener('resize', setClassroomDimensions);
        return () => window.removeEventListener('resize', setClassroomDimensions);
    }, [])

    /**
     * Imposta le dimensioni del canvas
     */
    const setClassroomDimensions = () => {
        if (!contentContainer.current) return;
        const { width, height } = contentContainer.current.getBoundingClientRect();
        const offset = 100;
        setCanvasDimensions({ width: width - offset, height: height - offset });
    }

    return (
        <div className="ClassroomPage">
            <div className="left-menu">
                <div className="navLinks">
                    <NavLink to={`/${ID}/`} exact className="navLink"
                        activeClassName="active"
                        title="Mappa della classe" >
                        <FontAwesomeIcon icon={faMap} />
                    </NavLink>
                    <NavLink to={`/${ID}/edit`} exact className="navLink"
                        activeClassName="active" title="Modifica i posti">
                        <FontAwesomeIcon icon={faEdit} />
                    </NavLink>
                    <NavLink to={`/${ID}/history`} exact className="navLink"
                        activeClassName="active" title="Cronologia">
                        <FontAwesomeIcon icon={faHistory} />
                    </NavLink>
                    <NavLink to={`/${ID}/settings`} exact className="navLink"
                        activeClassName="active" title="Impostazioni">
                        <FontAwesomeIcon icon={faCog} />
                    </NavLink>
                </div>
            </div>
            <div className="content" ref={contentContainer}>
                <Route path="/:class_id" exact component={() => (<MapView
                    desks={DESKS} students={STUDENTS_TEST}
                    canvasWidth={canvasDimensions.width}
                    canvasHeight={canvasDimensions.height}
                />)} />
                <Route path="/:class_id/edit" exact component={EditView} />
                <Route path="/:class_id/history" exact component={HistoryView} />
                <Route path="/:class_id/settings" exact component={SettingsView} />
            </div>
            <div className="right-menu">
                <div className="classroom-info">
                    <h2>CLASSE</h2>
                    <h3 className="classroom-name">3°A ordinario LSDV</h3>
                    <h4 className="classroom-id">#w8ew89e</h4>
                </div>
                <div className="students">
                    <h4 className="section-title">{STUDENTS_TEST.length} studenti:</h4>
                    <div className="students-container">
                        {STUDENTS_TEST.map((student, index) => (
                            <div className="student" key={index}>
                                <div className="thumbnail" >
                                    {student[0] + student[1]}
                                </div>
                                <p>{student}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}




