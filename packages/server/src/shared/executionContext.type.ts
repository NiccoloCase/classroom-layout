import { ArgumentsHost } from "@nestjs/common";

export enum ExecutionContextType {
    GQL,
    HTTP,
}

export const getType = (context: ArgumentsHost) =>
    context.getArgs().length === 4
        ? ExecutionContextType.GQL
        : ExecutionContextType.HTTP;