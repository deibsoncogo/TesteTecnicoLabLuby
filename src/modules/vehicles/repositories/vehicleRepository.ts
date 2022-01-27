import { getRepository, Repository } from "typeorm";
import { ICreateVehicleDto } from "../dtos/iCreateVehicleDto";
import { IFindAllVehicleFilterDto } from "../dtos/iFindAllVehicleFilterDto";
import { VehicleEntity } from "../entities/vehicleEntity";
import { IVehicleRepository } from "./iVehicleRepository";

export class VehicleRepository implements IVehicleRepository {
  private vehicleRepository: Repository<VehicleEntity>;

  constructor() { this.vehicleRepository = getRepository(VehicleEntity); }

  async deleteIdVehicle(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }

  async findOneIdVehicle(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOne(id);

    return vehicle;
  }

  async findAllFilterVehicle(
    { category, brand, model, year, km, color, purchasePrice, status }: IFindAllVehicleFilterDto,
  ): Promise<VehicleEntity[]> {
    const vehicleQueryBuilder = await this.vehicleRepository.createQueryBuilder("vehicle");

    category && vehicleQueryBuilder.andWhere("vehicle.category = :category", { category });
    brand && vehicleQueryBuilder.andWhere("vehicle.brand = :brand", { brand });
    model && vehicleQueryBuilder.andWhere("vehicle.model = :model", { model });
    year && vehicleQueryBuilder.andWhere("vehicle.year = :year", { year });
    km && vehicleQueryBuilder.andWhere("vehicle.km = :km", { km });
    color && vehicleQueryBuilder.andWhere("vehicle.color = :color", { color });
    status && vehicleQueryBuilder.andWhere("vehicle.status = :status", { status });
    purchasePrice && vehicleQueryBuilder.andWhere(
      "vehicle.purchasePrice = :purchasePrice", { purchasePrice },
    );

    const vehicleGetMany = await vehicleQueryBuilder.getMany();

    return vehicleGetMany;
  }

  async createVehicle(
    { category, brand, model, year, km, color, purchasePrice }: ICreateVehicleDto,
  ): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.create({
      category,
      brand,
      model,
      year,
      km,
      color,
      purchasePrice,
      status: "disponível",
    });

    await this.vehicleRepository.save(vehicle);

    return vehicle;
  }
}
