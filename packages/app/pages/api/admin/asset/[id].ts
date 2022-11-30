import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { getAsset } from 'lib/services/directus/server';

export default withApiAuthRequired(getAsset);
