import fs from 'fs';
import path from 'path';

export const FILE_NAME = 'sharedGlobalData.json';
export const filePath = path.resolve(__dirname, FILE_NAME);

export const getSharedGlobalData = (): Record<string, unknown> => {
    let data: string | undefined;
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, 'utf-8');
    }

    return data ? JSON.parse(data) : {};
}

export const setSharedGlobalData = (value: Record<string, unknown>) => {
    fs.writeFileSync(filePath, JSON.stringify(value));
    return value;
}

export const dumpSharedGlobalData = () => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
