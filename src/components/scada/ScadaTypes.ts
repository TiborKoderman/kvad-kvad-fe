import { UUID } from "crypto";

export interface ScadaObjectTemplate {
    id: UUID | null;
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
            "states": Array<{
                name: string;
                selector: string;
                style: [
                    {
                        name: string;
                        value: string;
                    },
                ];
                class: string;
            }>;
        };
        svg: string;
    };
}