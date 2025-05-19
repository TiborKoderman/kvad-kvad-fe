import { UUID } from "crypto";

interface ScadaObjectTemplate {
    id: UUID;
    name: string;
    data: {
        metadata: {
            textFields: Array<{
                selector: string;
                tag?: {
                    id: string;
                };
                default: string;
                format: string;
            }>;
        };
        svg: SVGElement;
    };
}