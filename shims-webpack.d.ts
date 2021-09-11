declare module 'webpack-hot-middleware' {
  const middleware: any;
  export interface Options {
    [proName: string]: any;
  }

  export interface ClientOptions {
    [proName: string]: any;
  }

  export interface MiddlewareOptions {
    [proName: string]: any;
  }

  export default middleware;
}
declare module '*.svg?inline' {
  const content: any;
  export default content;
}

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
