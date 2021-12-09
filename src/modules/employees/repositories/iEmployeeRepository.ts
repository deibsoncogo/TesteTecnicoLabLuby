import { ICreateEmployeeDto } from "@employees/dtos/iCreateEmployeeDto";
import { IUpdateEmployeeDto } from "@employees/dtos/iUpdateEmployeeDto";
import { EmployeeEntity } from "@employees/entities/employeeEntity";

export interface IEmployeeRepository {
  create({ name, cpf, email, password, avatarUrl }: ICreateEmployeeDto): Promise<EmployeeEntity>;
  findOneCpf(cpf: number): Promise<EmployeeEntity>;
  findOneEmail(email: string): Promise<EmployeeEntity>;
  findOneId(id: string): Promise<EmployeeEntity>;
  list(): Promise<EmployeeEntity[]>;
  toggleAdmin(cpf: number): Promise<boolean>;

  update(
    { id, name, cpf, email, passwordNew, avatarUrl }: IUpdateEmployeeDto
  ): Promise<EmployeeEntity>;
}
