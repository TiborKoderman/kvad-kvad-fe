export class ErisBuilder {
  methods: ApiMethod[];
  interceptors: Interceptor;
}

const defaultMethods: ApiMethod[] = [
  {
    name: 'get',
    handlers: [
      () => fetch()
    ]
  }
];
export interface Interceptor {
  request?: (config: any) => any;
  response?: (response: any) => any;
}


interface Config {
  baseURL: string;

}

export interface ApiMethodDefinition {
  name: string;
  handlers: ApiMethodHandler[];
}

export type ApiMethodHandler = (...args: any[]) => Promise<any>;


