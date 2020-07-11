export function genericError(message?) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            message
        })
    }
}