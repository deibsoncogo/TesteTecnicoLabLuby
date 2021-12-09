import { Router } from "express";
import { EnsuredAuthorizedUserMiddleware } from "middlewares/ensuredAuthorizedUserMiddleware";
import { AuthenticateEmployeeController } from "@employees/useCases/authenticateEmployee/authenticateEmployeeController";
import { CreateEmployeeController } from "@employees/useCases/createEmployee/createEmployeeController";
import { ListEmployeeController } from "@employees/useCases/listEmployee/listEmployeeController";
import { ListOneEmployeeController } from "@employees/useCases/listOneEmployee/listOneEmployeeController";
import { ToggleEmployeeController } from "@employees/useCases/toggleEmployee/toggleEmployeeController";
import { ToggleEmployeeAdminController } from "@employees/useCases/toggleEmployeeAdmin/toggleEmployeeAdminController";
import { UpdateEmployeeController } from "@employees/useCases/updateEmployee/updateEmployeeController";

const employeeRouter = Router();

const authenticateEmployeeController = new AuthenticateEmployeeController();
const listOneEmployeeController = new ListOneEmployeeController();
const listEmployeeController = new ListEmployeeController();
const toggleEmployeeController = new ToggleEmployeeController();
const updateEmployeeController = new UpdateEmployeeController();
const toggleEmployeeAdminController = new ToggleEmployeeAdminController();

employeeRouter.post("/create", new CreateEmployeeController().handle);
employeeRouter.post("/authenticate", authenticateEmployeeController.handle);

employeeRouter.use(EnsuredAuthorizedUserMiddleware);
employeeRouter.get("/one/:id", listOneEmployeeController.handle);
employeeRouter.get("/all", listEmployeeController.handle);
employeeRouter.patch("/toggle", toggleEmployeeController.handle);
employeeRouter.put("/update/:idEmployee", updateEmployeeController.handle);
employeeRouter.patch("/toggleAdmin", toggleEmployeeAdminController.handle);

export { employeeRouter };
