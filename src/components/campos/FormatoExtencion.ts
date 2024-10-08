//formato para la extension

//Cambia la extencio de 100001 a 100-001
export default function formatExtension(extension: number): string {
    // La extensión sea un número válido
    if (typeof extension === 'number') {
        const extensionString = extension.toString();
        // Verifica la longitud y retorna el formato adecuado
        if (extensionString.length === 6) {
            const part1 = extensionString.slice(0, 3);
            const part2 = extensionString.slice(3, 6);
            return `${part1}-${part2}`;
        } else {
            // Si la longitud no es 6, simplemente retorna la extensión como string
            return extensionString;
        }
    }
    return '';
}

