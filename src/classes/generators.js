import faker from "faker";


export default class Generators {

    generateString(length) {

        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    };


    generateFormData() {

        let webKit = '----WebKitFormBoundary' + this.generateString(16);
        let firstName = faker.name.firstName();
        let lastName = faker.name.lastName();
        let email = faker.internet.email();
    
        return [webKit, firstName, lastName, email];
    };
}

