import { compare } from "bcryptjs";
import { AppError } from "errors/appError";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IAuthenticateEmployeeDto } from "../../dtos/iAuthenticateEmployeeDto";
import { IEmployeeRepository } from "../../repositories/iEmployeeRepository";

interface IToken {
  token: string;
}

@injectable()
export class AuthenticateEmployeeService {
  constructor(@inject("EmployeeRepository") private employeeRepository: IEmployeeRepository) { }

  async execute({ email, password }: IAuthenticateEmployeeDto): Promise<IToken> {
    const messageAuthenticateInvalid = "Email ou senha inválido";

    const employee = await this.employeeRepository.findOneEmailEmployee(email);

    if (employee.off) {
      throw new AppError("Este funcionário está desligado", 401);
    }

    if (!employee) {
      throw new AppError(messageAuthenticateInvalid, 401);
    }

    const passwordMatch = await compare(password, employee.password);

    if (!passwordMatch) {
      throw new AppError(messageAuthenticateInvalid, 401);
    }

    const token = sign(
      {}, "fa5473530e4d1a5a1e1eb53d2fedb10c", { subject: employee.id, expiresIn: "12h" },
    );

    return { token };
  }
}
