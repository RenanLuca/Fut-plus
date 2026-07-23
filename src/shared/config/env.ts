import "dotenv/config";
import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, validateSync } from "class-validator";

class Env {
  @IsString()
  @IsNotEmpty()
  jwtSecret!: string;

  @IsString()
  @IsNotEmpty()
  databaseUrl!: string;
}

const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(`Invalid environment variables: ${errors.toString()}`);
}

export { env };
