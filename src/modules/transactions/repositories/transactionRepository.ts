import { getRepository, Repository } from "typeorm";
import { VehicleEntity } from "../../vehicles/entities/vehicleEntity";
import { ICreateOneTransactionDto } from "../dtos/iCreateOneTransactionDto";
import { IFindFilterTransactionDto } from "../dtos/iFindFilterTransactionDto";
import { IUpdateOneTransactionDto } from "../dtos/iUpdateOneTransactionDto";
import { TransactionEntity } from "../entities/transactionEntity";
import { ITransactionRepository } from "./iTransactionRepository";

export class TransactionRepository implements ITransactionRepository {
  private transactionRepository: Repository<TransactionEntity>;

  private vehicleRepository: Repository<VehicleEntity>;

  constructor() {
    this.transactionRepository = getRepository(TransactionEntity);
    this.vehicleRepository = getRepository(VehicleEntity);
  }

  async findOneIdEmployeeTransaction(idEmployee: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({ idEmployee });

    return transaction;
  }

  async toggleTypeOneIdTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({ id });
    const vehicle = await this.vehicleRepository.findOne({ id: transaction.idVehicle });

    if (transaction.type === "venda") {
      transaction.type = "reserva";
      vehicle.status = "reservado";
    } else {
      transaction.type = "venda";
      vehicle.status = "vendido";
    }

    transaction.updatedAt = new Date();
    vehicle.updatedAt = new Date();

    await this.transactionRepository.save(transaction);
    await this.vehicleRepository.save(vehicle);

    const transactionSave = await this.transactionRepository.findOne({ id });

    return transactionSave;
  }

  async deleteOneIdTransaction(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({ id });
    const vehicle = await this.vehicleRepository.findOne({ id: transaction.idVehicle });

    vehicle.status = "disponível";
    vehicle.updatedAt = new Date();

    await this.vehicleRepository.save(vehicle);

    await this.transactionRepository.delete({ id });
  }

  async findOneIdTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({ id });

    return transaction;
  }

  async findOneIdVehicleTransaction(idVehicle: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({ idVehicle });

    return transaction;
  }

  async updateOneTransaction(
    { id, idEmployee, idVehicle, date, amount }: IUpdateOneTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({ id });

    transaction.idEmployee = idEmployee || transaction.idEmployee;
    transaction.idVehicle = idVehicle || transaction.idVehicle;
    transaction.date = date || transaction.date;
    transaction.amount = amount || transaction.amount;
    transaction.updatedAt = new Date();

    const transactionSave = await this.transactionRepository.save(transaction);

    return transactionSave;
  }

  async findFilterTransaction(
    { type, idEmployee, idVehicle, date, amount }: IFindFilterTransactionDto,
  ): Promise<TransactionEntity[]> {
    const transactionQuery = await this.transactionRepository
      .createQueryBuilder("transaction")
      .addOrderBy("transaction.createdAt", "ASC");

    type && transactionQuery.andWhere("transaction.type = :type", { type });
    idVehicle && transactionQuery.andWhere("transaction.idVehicle = :idVehicle", { idVehicle });
    date && transactionQuery.andWhere("transaction.date = :date", { date });
    amount && transactionQuery.andWhere("transaction.amount = :amount", { amount });
    idEmployee && transactionQuery.andWhere("transaction.idEmployee = :idEmployee", { idEmployee });

    const transactionGetMany = transactionQuery.getMany();

    return transactionGetMany;
  }

  async createOneTransaction(
    { type, idEmployee, idVehicle, date, amount }: ICreateOneTransactionDto,
  ): Promise<TransactionEntity> {
    const vehicle = await this.vehicleRepository.findOne({ id: idVehicle });

    if (type === "venda") {
      vehicle.status = "vendido";
    } else {
      vehicle.status = "reservado";
    }

    vehicle.updatedAt = new Date();

    await this.vehicleRepository.save(vehicle);

    const transaction = await this.transactionRepository.create({
      type,
      idEmployee,
      idVehicle,
      date,
      amount,
    });

    const transactionSave = await this.transactionRepository.save(transaction);

    return transactionSave;
  }
}
