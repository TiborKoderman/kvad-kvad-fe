import { UUID } from "crypto";

export interface ScadaObjectTemplate {
    id: UUID | null;
    name: string;
    data: {
        metadata: {
            textFields: Array<{
                selector: string;
                tags: [
                    {
                        id: string;
                    },
                ];
                default: string;
                format: string;
                expression: string;
            }>;
            states: Array<ObjectState>;
            components: Array<{
                name: string;
            }>;
        };
        svg: string;
    };
}

export interface ObjectState{
    name: string;
    expression: string;
    elements: Array<{
        selector: string;
        attributes: Array<{
            name: string;
            value: string;
        }>;
        style: Array<{
            name: string;
            value: string;
        }>;
        classList: Array<string>;

    }>;
}