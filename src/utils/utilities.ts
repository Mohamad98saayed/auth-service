export const generateUniqueUsername = (firstName: string, lastName: string) => {
     const capitalize = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     const capFirstName = capitalize(firstName);
     const capLastName = capitalize(lastName);
     const uniqueNumber = Date.now().toString().slice(-4);
     const username = `${capFirstName}.${capLastName}.${uniqueNumber}`;
     return username;
}

export const parseDuplicateKeyError = (error: any) => {
     const detail = error.detail;
     const keyMatch = detail.match(/Key \((.*?)\)=\((.*?)\) already exists\./);
     const keyName: string = keyMatch[1];
     const keyValue: string = keyMatch[2];
     return { key: keyName, value: keyValue };
}
