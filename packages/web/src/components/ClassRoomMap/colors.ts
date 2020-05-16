export const classroomMapColors = {
    light: {
        desksFillColor: "#eeeeee",
        desksStrokeColor: "#dadce0",
        textColor: "#909090",
        backgroundColor: null,
    } as IClassroomMapColors,
    dark: {
        desksFillColor: "#5f6368",
        desksStrokeColor: "#303030",
        textColor: "#f5f5f5",
        backgroundColor: null,
    } as IClassroomMapColors
}

export interface IClassroomMapColors {
    desksFillColor?: string | null,
    desksStrokeColor?: string | null,
    textColor?: string | null,
    backgroundColor?: string | null,
}