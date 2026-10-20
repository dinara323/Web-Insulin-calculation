export class CreateServiceDto {
  name!: string;
  description!: string;
  age?: number;
  weight?: number;
  sensitivityCoefficient?: number;
}