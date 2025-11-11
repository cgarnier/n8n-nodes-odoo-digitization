import {
	IAuthenticateGeneric,
	IconFile,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OdooApi implements ICredentialType {
  name = 'odooApi';
  displayName = 'Odoo API';
	icon: IconFile = 'file:../nodes/OdooDigitization/odoo.svg';
  documentationUrl = 'https://www.odoo.com/documentation/';
  properties: INodeProperties[] = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      default: 'https://your-odoo.com',
      placeholder: 'https://your-odoo.com',
      required: true,
    },
    {
      displayName: 'Database',
      name: 'db',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.url}}',
      url: '/web/session/authenticate',
      method: 'POST',
      body: {
        jsonrpc: '2.0',
        params: {
          db: '={{$credentials.db}}',
          login: '={{$credentials.username}}',
          password: '={{$credentials.password}}',
        },
      },
    },
  };
}
