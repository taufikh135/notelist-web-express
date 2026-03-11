import z from "zod";

export const getErrorsFromZod: (safeParseResult: z.ZodSafeParseResult<any>) => string[] = (safeParseResult) => {
    if (safeParseResult.success) {
        return [];
    }
    return safeParseResult.error.issues.map((issue) => issue.message);
};
