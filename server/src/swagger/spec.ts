const localizedString = {
  type: 'object',
  required: ['ro', 'ru', 'en'],
  properties: {
    ro: { type: 'string', example: 'Text în română' },
    ru: { type: 'string', example: 'Текст на русском' },
    en: { type: 'string', example: 'Text in English' },
  },
}

const localizedStringList = {
  type: 'object',
  required: ['ro', 'ru', 'en'],
  properties: {
    ro: { type: 'array', items: { type: 'string' } },
    ru: { type: 'array', items: { type: 'string' } },
    en: { type: 'array', items: { type: 'string' } },
  },
}

const errorResponse = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message'],
      properties: {
        code: { type: 'string', example: 'NOT_FOUND' },
        message: { type: 'string', example: 'Resource not found' },
      },
    },
  },
}

const paginationParams = [
  {
    name: 'limit',
    in: 'query',
    description: 'Maximum items to return (1–100)',
    schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
  },
  {
    name: 'offset',
    in: 'query',
    description: 'Number of items to skip',
    schema: { type: 'integer', default: 0, minimum: 0 },
  },
]

const paginatedShape = (schemaRef: string) => ({
  type: 'object',
  required: ['data', 'total', 'limit', 'offset'],
  properties: {
    data: { type: 'array', items: { $ref: schemaRef } },
    total: { type: 'integer', example: 4 },
    limit: { type: 'integer', example: 20 },
    offset: { type: 'integer', example: 0 },
  },
})

const authRequired = [{ bearerAuth: [] }]

const responses401 = { description: 'Missing or expired token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
const responses403 = { description: 'Insufficient permissions', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
const responses404 = { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
const responses409 = { description: 'ID or slug conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
const responses400 = { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }

function crudPaths(
  tag: string,
  basePath: string,
  schemaName: string,
  idDescription = 'Resource ID',
) {
  const schemaRef = `#/components/schemas/${schemaName}`
  const paginatedRef = `#/components/schemas/Paginated${schemaName}`
  return {
    [`/api${basePath}`]: {
      get: {
        tags: [tag],
        summary: `List ${schemaName}s`,
        security: authRequired,
        parameters: paginationParams,
        responses: {
          200: { description: 'Paginated list', content: { 'application/json': { schema: { $ref: paginatedRef } } } },
          401: responses401,
          403: responses403,
        },
      },
      post: {
        tags: [tag],
        summary: `Create ${schemaName}`,
        security: authRequired,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: schemaRef } } } },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: schemaRef } } } },
          400: responses400,
          401: responses401,
          403: responses403,
          409: responses409,
        },
      },
    },
    [`/api${basePath}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Get ${schemaName} by ID`,
        security: authRequired,
        parameters: [{ name: 'id', in: 'path', required: true, description: idDescription, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Found', content: { 'application/json': { schema: { $ref: schemaRef } } } },
          401: responses401,
          403: responses403,
          404: responses404,
        },
      },
      put: {
        tags: [tag],
        summary: `Replace ${schemaName}`,
        security: authRequired,
        parameters: [{ name: 'id', in: 'path', required: true, description: idDescription, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: schemaRef } } } },
        responses: {
          200: { description: 'Updated', content: { 'application/json': { schema: { $ref: schemaRef } } } },
          400: responses400,
          401: responses401,
          403: responses403,
          404: responses404,
          409: responses409,
        },
      },
      delete: {
        tags: [tag],
        summary: `Delete ${schemaName}`,
        security: authRequired,
        parameters: [{ name: 'id', in: 'path', required: true, description: idDescription, schema: { type: 'string' } }],
        responses: {
          204: { description: 'Deleted' },
          401: responses401,
          403: responses403,
          404: responses404,
        },
      },
    },
  }
}

export const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Vitrina Timpului — Museum API',
    version: '1.0.0',
    description:
      'CRUD REST API for the Bălți museum exhibition. All `/api/*` routes require a Bearer JWT obtained from `POST /token`.',
  },
  servers: [{ url: 'http://localhost:3001', description: 'Development server' }],
  tags: [
    { name: 'Auth', description: 'Token issuance' },
    { name: 'Halls', description: 'Museum halls' },
    { name: 'Exhibits', description: 'Museum exhibits' },
    { name: 'Historical People', description: 'Historical persons' },
    { name: 'Timeline Events', description: 'Historical timeline events' },
    { name: 'Quiz Sets', description: 'Quiz sets with nested questions' },
    { name: 'Badge Definitions', description: 'Gamification badge catalog' },
    { name: 'Leaderboard', description: 'Per-game leaderboard (top 20 per key)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      LocalizedString: localizedString,
      LocalizedStringList: localizedStringList,
      ErrorResponse: errorResponse,

      Hall: {
        type: 'object',
        required: ['id', 'slug', 'title', 'coverImage', 'order'],
        properties: {
          id: { type: 'string', example: 'hall-old-balti' },
          slug: { type: 'string', example: 'old-balti' },
          title: { $ref: '#/components/schemas/LocalizedString' },
          coverImage: { type: 'string', format: 'uri' },
          order: { type: 'integer', minimum: 0, example: 1 },
        },
      },
      PaginatedHall: paginatedShape('#/components/schemas/Hall'),

      ExhibitEra: {
        type: 'string',
        enum: ['antiquity', 'medieval', 'early_modern', 'modern', 'contemporary'],
      },
      ExhibitCategory: {
        type: 'string',
        enum: ['architecture', 'numismatics', 'crafts', 'daily_life', 'urbanism', 'personalities'],
      },

      Exhibit: {
        type: 'object',
        required: ['id', 'hallId', 'slug', 'title', 'shortDescription', 'longDescription', 'era', 'category', 'heroImage', 'funFacts'],
        properties: {
          id: { type: 'string', example: 'exhibit-market-square' },
          hallId: { type: 'string', example: 'hall-old-balti' },
          slug: { type: 'string', example: 'central-market-1920s' },
          title: { $ref: '#/components/schemas/LocalizedString' },
          shortDescription: { $ref: '#/components/schemas/LocalizedString' },
          longDescription: { $ref: '#/components/schemas/LocalizedString' },
          era: { $ref: '#/components/schemas/ExhibitEra' },
          category: { $ref: '#/components/schemas/ExhibitCategory' },
          heroImage: { type: 'string', format: 'uri' },
          relatedPersonIds: { type: 'array', items: { type: 'string' } },
          relatedArtifactIds: { type: 'array', items: { type: 'string' } },
          relatedEventIds: { type: 'array', items: { type: 'string' } },
          funFacts: { $ref: '#/components/schemas/LocalizedStringList' },
        },
      },
      PaginatedExhibit: paginatedShape('#/components/schemas/Exhibit'),

      HistoricalPerson: {
        type: 'object',
        required: ['id', 'slug', 'name', 'role', 'bioShort', 'portraitImage'],
        properties: {
          id: { type: 'string', example: 'person-alecsandri' },
          slug: { type: 'string', example: 'vasile-alecsandri' },
          name: { $ref: '#/components/schemas/LocalizedString' },
          role: { $ref: '#/components/schemas/LocalizedString' },
          birthYear: { type: 'integer', example: 1821 },
          deathYear: { type: 'integer', example: 1890 },
          bioShort: { $ref: '#/components/schemas/LocalizedString' },
          portraitImage: { type: 'string', format: 'uri' },
          exhibitIds: { type: 'array', items: { type: 'string' } },
        },
      },
      PaginatedHistoricalPerson: paginatedShape('#/components/schemas/HistoricalPerson'),

      TimelineEvent: {
        type: 'object',
        required: ['id', 'year', 'title', 'summary', 'detail', 'era'],
        properties: {
          id: { type: 'string', example: 'evt-balti-fair-1588' },
          year: { type: 'integer', example: 1588 },
          title: { $ref: '#/components/schemas/LocalizedString' },
          summary: { $ref: '#/components/schemas/LocalizedString' },
          detail: { $ref: '#/components/schemas/LocalizedString' },
          era: { $ref: '#/components/schemas/ExhibitEra' },
          image: { type: 'string', format: 'uri' },
          relatedExhibitIds: { type: 'array', items: { type: 'string' } },
        },
      },
      PaginatedTimelineEvent: paginatedShape('#/components/schemas/TimelineEvent'),

      QuizQuestion: {
        type: 'object',
        required: ['id', 'prompt', 'choices', 'correctIndex', 'explanation'],
        properties: {
          id: { type: 'string', example: 'q-b-1' },
          prompt: { $ref: '#/components/schemas/LocalizedString' },
          choices: {
            type: 'array',
            minItems: 2,
            items: { $ref: '#/components/schemas/LocalizedString' },
          },
          correctIndex: { type: 'integer', minimum: 0, example: 0 },
          explanation: { $ref: '#/components/schemas/LocalizedString' },
        },
      },
      QuizSet: {
        type: 'object',
        required: ['id', 'title', 'passThreshold', 'questions'],
        properties: {
          id: { type: 'string', example: 'quiz-balti-urban' },
          title: { $ref: '#/components/schemas/LocalizedString' },
          passThreshold: { type: 'integer', minimum: 0, example: 3 },
          questions: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/QuizQuestion' },
          },
        },
      },
      PaginatedQuizSet: paginatedShape('#/components/schemas/QuizSet'),

      BadgeDefinition: {
        type: 'object',
        required: ['id', 'title', 'description'],
        properties: {
          id: { type: 'string', example: 'badge:urban-quiz' },
          title: { $ref: '#/components/schemas/LocalizedString' },
          description: { $ref: '#/components/schemas/LocalizedString' },
          icon: { type: 'string', example: '🏛️' },
        },
      },
      PaginatedBadgeDefinition: paginatedShape('#/components/schemas/BadgeDefinition'),

      LeaderboardEntry: {
        type: 'object',
        required: ['pseudonym', 'score', 'at'],
        properties: {
          pseudonym: { type: 'string', example: 'AlexM' },
          score: { type: 'number', example: 8 },
          at: { type: 'string', format: 'date-time', example: '2025-06-01T10:00:00.000Z' },
        },
      },

      TokenResponse: {
        type: 'object',
        required: ['accessToken', 'tokenType', 'expiresIn', 'role', 'permissions'],
        properties: {
          accessToken: { type: 'string' },
          tokenType: { type: 'string', example: 'Bearer' },
          expiresIn: { type: 'string', example: '60s' },
          role: { type: 'string', enum: ['ADMIN', 'WRITER', 'VISITOR'] },
          permissions: {
            type: 'array',
            items: { type: 'string', enum: ['READ', 'WRITE', 'DELETE'] },
          },
        },
      },
    },
  },
  paths: {
    '/token': {
      get: {
        tags: ['Auth'],
        summary: 'Issue JWT via query params',
        description: 'Public endpoint. Returns a signed JWT valid for `JWT_EXPIRES_IN` (default 60 s).',
        parameters: [
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['ADMIN', 'WRITER', 'VISITOR'], default: 'VISITOR' } },
          { name: 'permissions', in: 'query', description: 'Comma-separated extra permissions, e.g. `READ,WRITE`', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Token issued', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
          400: responses400,
        },
      },
      post: {
        tags: ['Auth'],
        summary: 'Issue JWT via JSON body',
        description: 'Public endpoint. Role defaults to `VISITOR` when omitted.',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['ADMIN', 'WRITER', 'VISITOR'] },
                  permissions: { type: 'array', items: { type: 'string', enum: ['READ', 'WRITE', 'DELETE'] } },
                },
              },
              example: { role: 'WRITER' },
            },
          },
        },
        responses: {
          200: { description: 'Token issued', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
          400: responses400,
        },
      },
    },

    ...crudPaths('Halls', '/halls', 'Hall', 'Hall ID (e.g. hall-old-balti)'),

    '/api/exhibits': {
      get: {
        tags: ['Exhibits'],
        summary: 'List exhibits',
        security: authRequired,
        parameters: [
          ...paginationParams,
          { name: 'hallId', in: 'query', schema: { type: 'string' }, description: 'Filter by hall ID' },
          { name: 'era', in: 'query', schema: { $ref: '#/components/schemas/ExhibitEra' } },
          { name: 'category', in: 'query', schema: { $ref: '#/components/schemas/ExhibitCategory' } },
        ],
        responses: {
          200: { description: 'Paginated list', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedExhibit' } } } },
          401: responses401,
          403: responses403,
        },
      },
      post: {
        tags: ['Exhibits'],
        summary: 'Create exhibit',
        security: authRequired,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Exhibit' } } } },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exhibit' } } } },
          400: responses400,
          401: responses401,
          403: responses403,
          409: responses409,
        },
      },
    },
    '/api/exhibits/{id}': {
      get: {
        tags: ['Exhibits'],
        summary: 'Get exhibit by ID',
        security: authRequired,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exhibit' } } } },
          401: responses401, 403: responses403, 404: responses404,
        },
      },
      put: {
        tags: ['Exhibits'],
        summary: 'Replace exhibit',
        security: authRequired,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Exhibit' } } } },
        responses: {
          200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exhibit' } } } },
          400: responses400, 401: responses401, 403: responses403, 404: responses404, 409: responses409,
        },
      },
      delete: {
        tags: ['Exhibits'],
        summary: 'Delete exhibit',
        security: authRequired,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Deleted' }, 401: responses401, 403: responses403, 404: responses404 },
      },
    },

    ...crudPaths('Historical People', '/historical-people', 'HistoricalPerson', 'Person ID'),
    ...crudPaths('Timeline Events', '/timeline-events', 'TimelineEvent', 'Event ID'),
    ...crudPaths('Quiz Sets', '/quiz-sets', 'QuizSet', 'QuizSet ID'),
    ...crudPaths('Badge Definitions', '/badge-definitions', 'BadgeDefinition', 'Badge ID'),

    '/api/leaderboard/{key}': {
      get: {
        tags: ['Leaderboard'],
        summary: 'Get leaderboard for a game key',
        security: authRequired,
        parameters: [
          { name: 'key', in: 'path', required: true, description: 'Game key (e.g. quiz-balti-urban)', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Top entries (max 20, sorted by score desc)', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/LeaderboardEntry' } } } } },
          401: responses401,
          403: responses403,
        },
      },
      post: {
        tags: ['Leaderboard'],
        summary: 'Submit a score',
        security: authRequired,
        parameters: [
          { name: 'key', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['pseudonym', 'score'], properties: { pseudonym: { type: 'string' }, score: { type: 'number' } } },
              example: { pseudonym: 'AlexM', score: 8 },
            },
          },
        },
        responses: {
          201: { description: 'Entry recorded', content: { 'application/json': { schema: { $ref: '#/components/schemas/LeaderboardEntry' } } } },
          400: responses400,
          401: responses401,
          403: responses403,
        },
      },
      delete: {
        tags: ['Leaderboard'],
        summary: 'Clear leaderboard for one key (DELETE permission)',
        security: authRequired,
        parameters: [
          { name: 'key', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 204: { description: 'Cleared' }, 401: responses401, 403: responses403 },
      },
    },

    '/api/leaderboard': {
      delete: {
        tags: ['Leaderboard'],
        summary: 'Clear ALL leaderboards (DELETE permission — admin only)',
        security: authRequired,
        responses: { 204: { description: 'All cleared' }, 401: responses401, 403: responses403 },
      },
    },
  },
}
