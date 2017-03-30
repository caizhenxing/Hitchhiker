import { StringUtil } from '../utils/string_util';
import { Record } from '../models/record';
import { EnvironmentService } from "./environment_service";

export class VariableService {

    static async applyVariableForRecord(envId: string, record: Record): Promise<Record> {
        const env = await EnvironmentService.get(envId, true);
        if (!env) {
            return record;
        }
        const variables = env.formatVariables;
        record.url = StringUtil.applyTemplate(record.url, variables);
        record.headers.forEach(header => {
            header.key = StringUtil.applyTemplate(header.key, variables);
            header.value = StringUtil.applyTemplate(header.value, variables);
        });

        return record;
    }
}