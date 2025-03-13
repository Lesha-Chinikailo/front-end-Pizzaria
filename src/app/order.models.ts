export interface OrderItem{
    id: number, 
    productId: number,
    quantity: number
}

export interface Order {
    id: number,
    username: string,
    isPaid: boolean,
    orderItems: OrderItem[];
}
