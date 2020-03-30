import * as React from 'react';
import Slider from "react-slick";
import * as classnames from "classnames"
import { GeneralInformationsForm } from "./forms/GeneralInformationsForm"
import "./createClassPage.scss";
import { StundentsForm } from './forms/StundentsForm';
import { ArrangeDesks } from './forms/ArrangeDesks';
import { LastStep } from "./forms/LastStep";

/** Numero di schermate */
const STEPS_NUMBER = 4;

export class CreateClassPage extends React.Component {

    state = {
        /** Schermata corrente */
        step: 2,
        /** Valori del form */
        form: [
            { classroomName: undefined, email: undefined },
            { students: undefined, },
            { desks: undefined }
        ],
        /** Se il bottone per andare avanti non è cliccabile */
        nextButtonDisabled: new Array(STEPS_NUMBER).fill(true)
    }

    slider: Slider | null;

    public render() {

        const sliderOptions = {
            initialSlide: this.state.step,
            dots: false,
            infinite: false,
            draggable: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        }

        return (
            <div className="CreateClassPage">
                <div className="container">
                    <h1 className="title">Registra una nuova classe</h1>
                    <div className="form">
                        <div id="CreateClassPage__form-content">
                            <Slider ref={c => (this.slider = c)}  {...sliderOptions} >
                                <GeneralInformationsForm id={0} storeValues={this.storeValues} />
                                <StundentsForm id={1} storeValues={this.storeValues} />
                                <ArrangeDesks
                                    id={2}
                                    storeValues={this.storeValues}
                                    studensNumber={this.state.form[1].students ?
                                        (this.state.form[1].students as any).length : null
                                    } />
                                <LastStep
                                    name={this.state.form[0].classroomName}
                                    email={this.state.form[0].email}
                                    students={this.state.form[1].students}
                                    desks={this.state.form[2].desks}
                                />
                            </Slider>
                        </div>
                        <div className="form-footer">
                            <button onClick={this.prevStep} id="btn-prev"
                                style={{ visibility: this.state.step > 0 ? "visible" : "hidden" }} >
                                Indietro
                            </button>
                            <div className="dots">
                                {this.drawDots()}
                            </div>
                            <button onClick={this.nextStep} id="btn-next"
                                style={{ visibility: this.state.step === STEPS_NUMBER - 1 ? "hidden" : "visible" }}
                                disabled={this.state.nextButtonDisabled[this.state.step]}>
                                Avanti
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    /**
     * Resituisce un array di elementi rappresentanti i puntini di impaginatura 
     */
    private drawDots = () => {
        const dots = [];
        for (let i = 0; i < STEPS_NUMBER; i++) {
            dots.push(<div className={classnames("dot", { active: this.state.step === i })} key={i} />);
        }
        return dots;
    }

    /**
     * Aggiorna lo stato con i valori ricevyti dai vari form
     */
    private storeValues = (...args: any[]) => {
        const { form } = this.state;
        const key = args[args.length - 1];
        const obj = form[key];
        this.state.nextButtonDisabled[key] = false;

        for (let i = 0; i < Object.keys(obj).length; i++) {
            // aggiorna l'ogetto con i nuovi valori
            obj[Object.keys(obj)[i]] = args[i];
            // controlla se ci sono valori nulli
            if (args[i] == null) this.state.nextButtonDisabled[key] = true;
        }
        this.setState({ form });
    }


    /**
     * Passa allo step sucessivo se è possibile
     */
    private nextStep = () => {
        // controlla se gli step sono finiti 
        if (this.slider && this.state.step < STEPS_NUMBER - 1) {
            // va allo step sucessivo
            this.slider.slickNext()
            this.setState({ step: this.state.step + 1 })
        }
    }

    /**
     * Torna allo step precedente se è possibile
     */
    private prevStep = () => {
        if (this.slider && this.state.step > 0) {
            this.slider.slickPrev()
            this.setState({ step: this.state.step - 1 })
        }
    }
}
