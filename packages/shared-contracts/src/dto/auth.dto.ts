// Pure DTO interfaces - no domain entity imports

export interface LoginRequestDTO {
  phoneNumber: string;
  passCode: string;
}

export interface LoginResponseDTO {
  token: string;
  refreshToken: string;
}
