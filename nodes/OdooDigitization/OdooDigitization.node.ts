import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class OdooDigitization implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Odoo Digitization',
    name: 'odooDigitization',
    icon: 'file:odoo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Trigger Digitization processing on Odoo invoices',
    defaults: {
      name: 'Odoo Digitization',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'odooApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Trigger Digitization',
            value: 'digitization',
            description: 'Trigger Digitization processing on an invoice',
            action: 'Trigger digitization on invoice',
          },
        ],
        default: 'digitization',
      },
      {
        displayName: 'Invoice ID',
        name: 'invoiceId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: {
            operation: ['digitization'],
          },
        },
        description: 'ID of the account.move record',
      },
    ],
		usableAsTool: true,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials('odooApi');
    const url = credentials.url as string;
    const db = credentials.db as string;
    const username = credentials.username as string;
    const password = credentials.password as string;

    for (let i = 0; i < items.length; i++) {
      try {
        // const operation = this.getNodeParameter('operation', i);
        const invoiceId = this.getNodeParameter('invoiceId', i) as number;

        // 1. Authenticate
        const authResponse = await this.helpers.httpRequest({
          method: 'POST',
          url: `${url}/jsonrpc`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: 'common',
              method: 'login',
              args: [db, username, password],
            },
            id: Math.floor(Math.random() * 1000000),
          },
          json: true,
        });

        if (authResponse.error) {
          throw new NodeOperationError(
            this.getNode(),
            `Auth failed: ${authResponse.error.data.message}`,
          );
        }

        const uid = authResponse.result;

        if (!uid) {
          throw new NodeOperationError(this.getNode(), 'Authentication failed: no UID');
        }
        
        const digitizationResponse = await this.helpers.httpRequest({
          method: 'POST',
          url: `${url}/jsonrpc`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: 'object',
              method: 'execute_kw',
              args: [
                db,
                uid,
                password,
                'account.move',
                'action_manual_send_for_digitization',
                [[invoiceId]],
              ],
            },
            id: Math.floor(Math.random() * 1000000),
          },
          json: true,
        });

        if (digitizationResponse.error) {
          throw new NodeOperationError(
            this.getNode(),
            `Digitization call failed: ${digitizationResponse.error.data.message}`,
          );
        }

        returnData.push({
          json: {
            success: true,
            invoiceId,
            result: digitizationResponse.result,
          },
          pairedItem: { item: i },
        });

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
