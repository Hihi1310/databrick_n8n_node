import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DatabricksWarehouseApi implements ICredentialType {
	name = 'databricksWarehouseApi';
	displayName = 'Databricks Warehouse API';
	
	
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	properties: INodeProperties[] = [
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
            placeholder: "Enter access API key for your Databricks account",
            description: 'Your Databricks API key for authentication and service usage.',
			required: true,
			
		},

		{
			displayName: 'Server Hostname',
			name: "serverHostname",
			type: "string",
			default: "",
			placeholder: "Enter the server hostname on databricks",
			description: 'The server hostname for your Databricks account. Ex: https://<provider>',
			required: true,
		},
		{
			displayName: 'Warehouse ID',
			name: "warehouseId",
			type: "string",
			default: "",
			placeholder: 'Enter the warehouse ID on databricks',
			required: true,
		},


	];
	
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
                Authorization: 'Bearer {{$credentials?.authToken}}',
            },
		},
	};
};
