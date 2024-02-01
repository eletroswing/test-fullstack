import { ZodTypeAny } from "zod";

export default (schema: ZodTypeAny ) => (dto: any) => {
    const response: any = schema.safeParse(dto);
    return response.data;
};
