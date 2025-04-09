export interface IGenericAdapter<T,U> {
    convertEntityToModel(entity: T): U; 
}