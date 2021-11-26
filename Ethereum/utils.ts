const border = '****************************************************************'
const space = ''

function printEach(data: any) {
    console.log(data)
}

export function print (list: any[], printBorder: boolean): void {
    const top = [border, border, space]
    const bottom = [space, border, border]

    if (printBorder) {
        top.concat(list)
            .concat(bottom)
            .forEach(printEach)
    } else {
        list.forEach(printEach)
    }
}
