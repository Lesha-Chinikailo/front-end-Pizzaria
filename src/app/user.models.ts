export interface UserRegister {
    username: string,
    password: string,
    role: string
}

export interface UserLogin {
    username: string,
    password: string
}

export interface TokenDto {
    token: string
}
