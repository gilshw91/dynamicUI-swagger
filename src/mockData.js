export const mockData = {
  swagger: '2.0',
  info: {
    description: 'This is the Customer API.',
    version: '1.0.0',
    title: 'Customer API',
    contact: {
      name: 'Yoav Melamed',
      url: 'http://www.yoav.com',
      email: 'me@domain.com',
    },
    license: {
      name: "Apache '2.0'",
      url: 'http://www.apache.com',
    },
  },
  host: 'api.globalmantics.com',
  basePath: '/crm/v1',
  schemes: ['http', 'https'],
  security: [
    {
      BasicAuth: [],
    },
  ],
  paths: {
    '/customer': {
      get: {
        summary: "reads a customer's data",
        description:
          "This operation provides a view of a customer's data in Json. The operation uses the customer id to identify the customer and a query string",
        operationId: 'getCustomer',
        produces: ['application/json'],
        parameters: [
          {
            name: 'customerId',
            in: 'query',
            description: 'pass an optional customer id',
            required: true,
            type: 'integer',
          },
        ],
        responses: {
          200: {
            description: 'search results matched',
            schema: {
              $ref: '#/definitions/Customer',
            },
          },
          404: {
            description: 'employee with this id does not exist.',
          },
        },
      },
      post: {
        summary: 'adds a new customer',
        description: 'Add a new customer to the system',
        operationId: 'addCustomer',
        consumes: ['application/json'],
        produces: ['text/plain'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'the new customer data in JSON',
            required: true,
            schema: {
              $ref: '#/definitions/Customer',
            },
          },
        ],
        responses: {
          200: {
            description: 'successfull operation',
            schema: {
              type: 'integer',
            },
          },
          405: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/customer/{customerId}': {
      put: {
        summary: 'update existing customer',
        description: 'Updates an existing customer followed by Id',
        operationId: 'updateCustomer',
        consumes: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'the updated customer data in JSON',
            required: true,
            schema: {
              $ref: '#/definitions/Customer',
            },
          },
          {
            name: 'customerId',
            in: 'path',
            description: 'the id of the customer to update',
            required: true,
            type: 'integer',
          },
        ],
        responses: {
          200: {
            description: 'Success.',
          },
          404: {
            description: 'Customer not found.',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
      delete: {
        summary: 'delete existing customer',
        description: 'Delete an existing customer followed by Id',
        operationId: 'deleteCustomer',
        produces: ['application/json'],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            description: 'the id of the customer to delete',
            required: true,
            type: 'integer',
          },
        ],
        responses: {
          200: {
            description: 'The customer was deleted',
            schema: {
              $ref: '#/definitions/Customer',
            },
          },
          404: {
            description: 'Customer not found.',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [
          {
            BasicAuth: [],
          },
        ],
      },
    },
  },
  securityDefinitions: {
    BasicAuth: {
      type: 'basic',
    },
  },
  definitions: {
    Customer: {
      type: 'object',
      properties: {
        customerId: {
          type: 'integer',
        },
        accountValue: {
          type: 'number',
        },
        active: {
          type: 'boolean',
        },
        address: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            street: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
            zip: {
              type: 'string',
            },
          },
        },
        contacts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              email: {
                type: 'string',
              },
              phone: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
