export function Auth(params) {
    console.log(params);
    return (target: any) => {
        console.log(target);
        return target;
    }
}