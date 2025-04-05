import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	LoggerProxy as Logger
} from 'n8n-workflow';
import { NodeConnectionType} from 'n8n-workflow';

export class DatabricksWarehouse implements INodeType {
    description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Databricks warehouse API',
		name: 'databricksWarehouse',
		icon: 'file:Databricks_icon.svg',
        group: [],
		version: 1,
		description: 'Call Databricks API services with id of the warehouse',
		defaults: {
			name: 'Databricks warehouse API',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.AiTool, NodeConnectionType.Main],
		credentials: [
			{
				name: 'databricksWarehouseApi',
				required: true,
			},
		],

		properties: [
            {
                displayName: 'SQL Script',
                name: 'sqlScript',
                type: 'string',
                default: '',
				typeOptions:{
					rows: 20,
				},
				description: 'The SQL script to execute on the Databricks warehouse ID',
            },
		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const sqlScript = this.getNodeParameter('sqlScript', 0) as string;

        //Get credentials the user provided for this node
        const credentials = await this.getCredentials('databricksApi') as IDataObject;

        const request_url = `${credentials.serverHostname}/api/2.0/sql/statements`;
        //make the request to the API
        const options: IHttpRequestOptions = {
            url: request_url,
            headers: {
                'Authorization': `Bearer ${credentials.authToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                "warehouse_id": credentials.warehouseId,
                "statement": sqlScript,
            }),
            json: true,

        };
        try {
            const responseData = await this.helpers.httpRequest.call(this, options);
            const outputData = Array.isArray(responseData.json) ? responseData.json : [responseData.json];

            Logger.info(`Databricks API Processed Output: ${JSON.stringify(outputData)}`);

            return [this.helpers.returnJsonArray([outputData])]; // Return the processed output as JSON

        } catch (error) {
            Logger.error(`Databricks API Error: ${error}`);
            return [];
        }
	}
}


