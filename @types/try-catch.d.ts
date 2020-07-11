declare module 'try-catch' {
    export default function tryCatch(fn: Function, value: any): [any, any];
}