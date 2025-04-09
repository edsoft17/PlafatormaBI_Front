export interface TableColumnsDefInterface {
    id: number;
    name?: string | "none";
    subName?: string;
    displayedName: string;
    estado?: string;
    nombreColumna?: string;
    type?:
        | "string"
        | "decimal"
        | "number"
        | "date"
        | "dateInput"
        | "datetime"
        | "boolean"
        | "time"
        | "acciones"
        | "mouseEvent"
        | "seleccionado"
        | "estado"
        | "estadoAdmision"
        | "accionesEvaluacionPe"
        | "accionesDescarga"
        | "moneda"
        | "monedaTC"
        | "input"
        | "input-number"
        | "select"
        | "accionesObservacionPO"
        | "accionesListaDetalle"
        | "construccion"
        | "url"
        | "porcentaje"
        | "checkbox"
        | "radiobutton"
        | "slideToggle"
        | "statusIndicator"
        | "photo"
        | "progress"
        | "progressDate"
        | "user"
        | "indicator"
        | "detail";
    format?: "fullDate" | "shortTime" | "shortTimeHour";
    customIcon?: string[][];
    minMaxDecimal?: [number, number];
    checked?: string;
    backgroundColorTitle?: string;
    components?: string[];
    alignTitle?: "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed";
    alignContent?: "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed";
}
