import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() // Mark properties I want to explicitly show in response
  id: number;

  @Expose()
  email: string;
}
