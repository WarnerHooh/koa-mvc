import promiser from '../utils/promiser';
import { getConnection } from '../config/databaseConf';

let connection = getConnection(),
		apis = ['query', 'insert'],
		promiserConnection = {};


apis.forEach((api) => {
	promiserConnection[api] = promiser(connection[api], connection);
})

Object.assign(promiserConnection, connection);

export default promiserConnection;