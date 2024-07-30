import { createHash } from 'crypto';

export function compoundHash(items: any[], withDate: boolean): string {
    const concatenatedShas = items.map((item) => item.sha).join('');
    const hash = createHash('sha256').update(concatenatedShas);
    
    if (withDate) {
        const currentTime = new Date().toISOString();
        hash.update(currentTime);
    }
    
    return hash.digest('hex');
};

export function identifyFileType(fileContent: string): string {
    const controllerPattern = /@Controller|\@GetMapping|\@PostMapping|\@DeleteMapping|\@PutMapping/;
    const servicePattern = /@Service|\@Injectable/;
    const repositoryPattern = /@Repository|findById\(|save\(/;
    const entityPattern = /@Entity/;

    if (controllerPattern.test(fileContent)) {
        return "Controller";
    } else if (servicePattern.test(fileContent)) {
        return "Service";
    } else if (repositoryPattern.test(fileContent)) {
        return "Repository";
    } else if (entityPattern.test(fileContent)) {
        return "Entity";
    }

    return "Unknown";
};

export const languagePicker = {
    "sh": "bash",
    "bash": "bash",
    "c": "c",
    "h": "c/cpp",
    "cpp": "cpp",
    "hpp": "cpp",
    "cc": "cpp",
    "cp": "cpp",
    "cxx": "cpp",
    "c++": "cpp",
    "hh": "cpp",
    "hxx": "cpp",
    "h++": "cpp",
    "cs": "c-sharp",
    "csx": "c-sharp",
    "py": "python",
    "py3": "python",
    "php": "php",
    "php3": "php",
    "php4": "php",
    "php5": "php",
    "php7": "php",
    "phps": "php",
    "phpt": "php",
    "phtml": "php",
    "mo": "modelica",
    "mos": "modelica",
    "java": "java",
    "js": "javascript",
    "elm": "elm",
    "r": "r",
    "rdata": "r",
    "rds": "r",
    "rda": "r",
    "scala": "scala",
    "sc": "scala",
    "sql": "sql",
    "ts": "typescript",
    "tsx": "tsx",
    "v": "verilog",
    "vh": "verilog"
};