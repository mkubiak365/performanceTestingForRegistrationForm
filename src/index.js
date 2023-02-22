import { sleep, check } from 'k6';
import http from 'k6/http';
import { parseHTML } from 'k6/html';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import faker from 'faker';
import Generators from './classes/generators';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

let generate = new Generators();

export const options = {
    scenarios: {
        form: {
            executor: 'per-vu-iterations',
            vus: 30,
            iterations: 1,
            maxDuration: '30s',
        },
    }
};

const baseUrl = 'https://magento.softwaretestingboard.com';
const urls = {
    form: `${baseUrl}/customer/account/create/`,
    submit: `${baseUrl}/customer/account/createpost/`,
};

function getForm() {
    const formResult = http.get(urls.form);
    const siteBody = parseHTML(formResult.body);
    const formKey = siteBody.find('input[name=form_key]').val();

    return formKey;
}

function submitForm(key) {

    let data = generate.generateFormData();
    let webKit = data[0];
    let firstName = data[1];
    let lastName = data[2];
    let email = data[3];

    console.log(email);

    const formData = new FormData()
    formData.boundary = webKit
    formData.append('form_key', key)
    formData.append('success_url', '')
    formData.append('error_url', '')
    formData.append('firstname', firstName)
    formData.append('lastname', lastName)
    formData.append('email', email)
    formData.append('password', 'testy1234$#@!')
    formData.append('password_confirmation', 'testy1234$#@!')
  
    const response = http.post(urls.submit,
      formData.body(),
      {
        headers: {
          'content-type': `multipart/form-data; boundary=${webKit}`,
        },
      }
    )
    sleep(1)

        check(response, {
          'is status 200': (r) => r.status === 200,
        });
}

export default function () {
    faker.seed(randomIntBetween(1, 1000));
    let key = getForm();
    sleep(1);
    submitForm(key);
}