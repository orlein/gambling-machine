import handlers from '@gambling-machine/src/mocks/handlers/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...handlers);
