declare namespace NodeJS {
  export interface ProcessEnv {
    AWS_REGION: string;
    STAGE: "prod" | "sand" | "test" | "dev";
  }
}
