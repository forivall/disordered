import type {
  Collection,
  Database,
  ReplicaSet,
  Shard,
  ShellInstanceState,
} from '@mongosh/shell-api';

interface ShellApiInstance {
  get _instanceState(): ShellInstanceState;
}

type ShellApi = ShellInstanceState['shellApi'];
type ShellBson = ShellInstanceState['shellBson'];
type ShellDatabase = SyncifyApi<Database> & {
  [collName: string]: SyncifyApi<Collection>;
};

type SyncifyMethod<Method> = Method extends (
  ...args: infer A
) => Promise<infer R>
  ? (...args: A) => SyncifyReturnValue<R>
  : Method extends (...args: infer A) => infer R
    ? R extends Database
      ? (...args: A) => ShellDatabase
      : R extends ShellApiInstance
        ? (...args: A) => SyncifyReturnValue<R>
        : Method
    : Method;

type SyncifyReturnValue<R> = R extends ShellApiInstance ? SyncifyApi<R> : R;

type SyncifyApi<Api> = {
  [K in keyof Api]: SyncifyMethod<Api[K]>;
};

// https://github.com/mongodb-js/mongosh/blob/6a6f97712a596a21c61408dfb925e729306030f8/packages/shell-api/src/shell-instance-state.ts#L214
declare global {
  /* eslint-disable no-var */
  var config: SyncifyApi<ShellApi['config']>;
  var use: SyncifyMethod<ShellApi['use']>;
  var show: SyncifyMethod<ShellApi['show']>;
  var exit: SyncifyMethod<ShellApi['exit']>;
  var quit: SyncifyMethod<ShellApi['quit']>;
  var Mongo: SyncifyMethod<ShellApi['Mongo']>;
  var connect: SyncifyMethod<ShellApi['connect']>;
  var it: SyncifyMethod<ShellApi['it']>;
  var version: SyncifyMethod<ShellApi['version']>;
  var load: SyncifyMethod<ShellApi['load']>;
  var enableTelemetry: SyncifyMethod<ShellApi['enableTelemetry']>;
  var disableTelemetry: SyncifyMethod<ShellApi['disableTelemetry']>;
  var passwordPrompt: SyncifyMethod<ShellApi['passwordPrompt']>;
  var sleep: SyncifyMethod<ShellApi['sleep']>;
  var print: SyncifyMethod<ShellApi['print']>;
  var printjson: SyncifyMethod<ShellApi['printjson']>;
  var convertShardKeyToHashed: SyncifyMethod<
    ShellApi['convertShardKeyToHashed']
  >;
  var cls: SyncifyMethod<ShellApi['cls']>;
  var isInteractive: SyncifyMethod<ShellApi['isInteractive']>;

  var DBRef: ShellBson['DBRef'];
  var bsonsize: ShellBson['bsonsize'];
  var MaxKey: ShellBson['MaxKey'];
  var MinKey: ShellBson['MinKey'];
  var ObjectId: ShellBson['ObjectId'];
  var Timestamp: ShellBson['Timestamp'];
  var Code: ShellBson['Code'];
  var NumberDecimal: ShellBson['NumberDecimal'];
  var NumberInt: ShellBson['NumberInt'];
  var NumberLong: ShellBson['NumberLong'];
  var ISODate: ShellBson['ISODate'];
  var BinData: ShellBson['BinData'];
  var HexData: ShellBson['HexData'];
  var UUID: ShellBson['UUID'];
  var MD5: ShellBson['MD5'];
  var Decimal128: ShellBson['Decimal128'];
  var BSONSymbol: ShellBson['BSONSymbol'];
  var Int32: ShellBson['Int32'];
  var Long: ShellBson['Long'];
  var Binary: ShellBson['Binary'];
  var Double: ShellBson['Double'];
  var EJSON: ShellBson['EJSON'];
  var BSONRegExp: ShellBson['BSONRegExp'];

  var rs: SyncifyApi<ReplicaSet>;
  var sh: SyncifyApi<Shard>;
  var db: ShellDatabase;
  /* eslint-enable no-var */
}

declare module 'mongodb' {
  export interface OperationOptions {
    session?: ClientSession | Session;
  }
}
