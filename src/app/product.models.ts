export interface Product {
    id: number
    categoryId: number,
    name?: string,
    price?: number,
    quantity?: number
    dateTimeOfManufacture?: Date,
    isAvailable: boolean
}
