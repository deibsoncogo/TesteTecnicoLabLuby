import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors/appError";
import { EmployeeRepository } from "../modules/employees/repositories/employeeRepository";

interface IToken {
  name: string;
  sub: string;
}

export async function EnsuredAuthorizedMiddleware(
  request: Request, response: Response, next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  let tokenVerify: IToken;

  try {
    tokenVerify = verify(token, "fa5473530e4d1a5a1e1eb53d2fedb10c") as IToken;
  } catch (error) {
    throw new AppError("Token inválido", 401);
  }

  const employeeRepository = new EmployeeRepository();

  const existsEmployee = await employeeRepository.findOneIdEmployee(tokenVerify.sub);

  if (!existsEmployee) {
    throw new AppError("ID do funcionário do token é inexistente", 401);
  }

  if (existsEmployee.off) {
    throw new AppError("Funcionário do token está desligado", 401);
  }

  request.idEmployeeAuthorized = tokenVerify.sub;

  return next();
}
