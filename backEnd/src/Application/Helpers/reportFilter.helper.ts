import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { AppError } from "@/Domain/Errors/app.error";
import { ReportFilter, ReportRange } from "@/Domain/Types/UserReport";
import { authMessages } from "@/Shared/Messages/AuthMessages";

 export interface ReportFilterInput {
  range: ReportRange;
  from?: string;
  to?: string;
}

 export function buildReportFilter(input: ReportFilterInput): ReportFilter {
            const now = new Date();
            let from: Date;
            let to: Date;

            switch (input.range) {
                case "today": {
                    from = new Date(now);
                    from.setHours(0, 0, 0, 0);

                    to = new Date(now);
                    to.setHours(23, 59, 59, 999);
                    break;
                }

                case "week": {
                    const day = now.getDay(); // Sunday = 0

                    from = new Date(now);
                    from.setDate(now.getDate() - day);
                    from.setHours(0, 0, 0, 0);

                    to = new Date(from);
                    to.setDate(from.getDate() + 6);
                    to.setHours(23, 59, 59, 999);
                    break;
                }

                case "month":{
                    from = new Date(now.getFullYear(), now.getMonth(), 1);
                    from.setHours(0, 0, 0, 0);

                    to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    to.setHours(23, 59, 59, 999);
                    break;
                }
                case "year": {
                    from = new Date(now.getFullYear(), 0, 1);
                    from.setHours(0, 0, 0, 0);

                    to = new Date(now.getFullYear(), 11, 31);
                    to.setHours(23, 59, 59, 999);
                    break;
                }

                case "custom":{
                    from = new Date(input.from!);
                    from.setHours(0, 0, 0, 0);

                    to = new Date(input.to!);
                    to.setHours(23, 59, 59, 999);
                    if (from > to) {
                        throw new AppError(authMessages.error.FROM_AND_TO_DATE_NOT_MATCH, StatusCodes.BAD_REQUEST);
                    }

                    break;
                }
                

                default:
                throw new AppError(authMessages.error.INVALID_REPORT_RANGE, StatusCodes.BAD_REQUEST);
            }

            return {
                range: input.range,
                from,
                to,
            };
        }