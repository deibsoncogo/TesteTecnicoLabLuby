import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../errors/appError";
import { FormatDate } from "../../../../utils/formatDate";
import { ICreateOneVehicleDto } from "../../dtos/iCreateOneVehicleDto";
import { VehicleEntity } from "../../entities/vehicleEntity";
import { IVehicleRepository } from "../../repositories/iVehicleRepository";

@injectable()
export class CreateOneVehicleService {
  constructor(@inject("VehicleRepository") private vehicleRepository: IVehicleRepository) { }

  async execute(
    { category, brand, model, year, km, color, purchasePrice }: ICreateOneVehicleDto,
  ): Promise<VehicleEntity> {
    const vehicleAlreadyExists = await this.vehicleRepository.findFilterVehicle({
      category,
      brand,
      model,
      year,
      color,
    });

    if (vehicleAlreadyExists.length !== 0) {
      throw new AppError("Já existe um veículo com estas especificações");
    }

    const vehicle = await this.vehicleRepository.createOneVehicle({
      category,
      brand,
      model,
      year,
      km,
      color,
      purchasePrice,
    });

    vehicle.createdAt = FormatDate(vehicle.createdAt);
    vehicle.updatedAt = FormatDate(vehicle.updatedAt);

    return vehicle;
  }
}
