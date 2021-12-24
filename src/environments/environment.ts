// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // url: 'http://192.168.20.35',
  // apiUrl: 'http://192.168.20.35/api/',
  // tritexTokenApi: 'http://192.168.20.35/tritextoken',
  url: 'https://uat1.tritexsolutions.com/Api',
  apiUrl: 'https://uat1.tritexsolutions.com/Api/api/',
  tritexTokenApi: 'https://uat1.tritexsolutions.com/Api/tritextoken',
  recaptchaKey: '6LcSbtMUAAAAADC--D0zbiJPX-uZ1hSZrPZLZVca',
  nodeEnvUrl: 'https://chatuat1.tritexsolutions.com/api/v1/',
  nodeUserList: 'https://chatuat1.tritexsolutions.com/api/v1/',
  nodeSocketUrl: 'https://chatuat1.tritexsolutions.com/',
  fileUploadUrl: 'https://chatuat1.tritexsolutions.com/api/v1/user/upload-file/',
  amchartsLicense: 'CH238503313',
  amchartsMapLicense: 'MP238503313',
  isFast: false
};
