import { getRepository, Repository } from "typeorm";
import { VehicleEntity } from "../../vehicles/entities/vehicleEntity";
import { ICreateTransactionDto } from "../dtos/iCreateTransactionDto";
import { iFindAllFilterTransactionDto } from "../dtos/iFindAllFilterTransactionDto";
import { IUpdateOneIdTransactionDto } from "../dtos/iUpdateOneIdTransactionDto";
import { TransactionEntity } from "../entities/transactionEntity";
import { ITransactionRepository } from "./iTransactionRepository";

export class TransactionRepository implements ITransactionRepository {
  private transactionRepository: Repository<TransactionEntity>;

  private vehicleRepository: Repository<VehicleEntity>;

  constructor() {
    this.transactionRepository = getRepository(TransactionEntity);
    this.vehicleRepository = getRepository(VehicleEntity);
  }

  async deleteOneIdTransaction(id: string): Promise<void> {
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

  async updateOneIdTransaction(
    { id, type, idEmployee, idVehicle, date, amount }: IUpdateOneIdTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({ id });

    transaction.type = type || transaction.type;
    transaction.idEmployee = idEmployee || transaction.idEmployee;
    transaction.idVehicle = idVehicle || transaction.idVehicle;
    transaction.date = date || transaction.date;
    transaction.amount = amount || transaction.amount;
    transaction.updatedAt = new Date();

    const transactionSave = await this.transactionRepository.save(transaction);

    return transactionSave;
  }

  async findAllFilterTransaction(
    { type, idEmployee, idVehicle, date, amount }: iFindAllFilterTransactionDto,
  ): Promise<TransactionEntity[]> {
    const transactionQuery = await this.transactionRepository.createQueryBuilder("transaction");

    type && transactionQuery.andWhere("transaction.type = :type", { type });
    idVehicle && transactionQuery.andWhere("transaction.idVehicle = :idVehicle", { idVehicle });
    date && transactionQuery.andWhere("transaction.date = :date", { date });
    amount && transactionQuery.andWhere("transaction.amount = :amount", { amount });
    idEmployee && transactionQuery.andWhere("transaction.idEmployee = :idEmployee", { idEmployee });

    const transactionFilter = transactionQuery.getMany();

    return transactionFilter;
  }

  async createTransaction(
    { type, idEmployee, idVehicle, date, amount }: ICreateTransactionDto,
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

    await this.transactionRepository.save(transaction);

    return transaction;
  }
}
