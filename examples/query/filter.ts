import * as query from './../../src/engine/query';

// const testQuery = {
//   numbers: { $filter: [1, 2, 3, 'a'] }
// }

const document = {
  name: 'admin',
  privileges: [
    {
      database: 'system',
      collection: 'users',
      actions: ['create', 'update'],
    },
    {
      database: 'system',
      collection: 'roles',
      actions: ['create'],
    },
  ],
  _id: '5fdeebd617c3bc6e2a91b640',
};

const testQuery = {
  privileges: { $filter: { collection: { $eq: 'roles' } } },
};
const compiledQuery = `record.numbers = record.numbers.filter(item => [1,2,3,'a'].some(element => isEqual(item, element)))`;

// `record.privileges = record.privileges.filter(item => item.database === 'system')`

const parsed = query.parse(testQuery);
console.log(JSON.stringify(parsed, null, 2));

const compiled = query.compile(parsed);

console.log(compiled);

const filteredDocument = query.runner(testQuery)(document)

console.log(JSON.stringify(filteredDocument, null, 2))

// const result = document.privileges.filter(item => item.collection === 'roles')
// console.log('result: %o', JSON.stringify(result))

// const result = document.privileges.filter(record => record.collection === 'roles')
// console.log('result: %o', JSON.stringify(result))

// const result = document.privileges.filter((record) =>
//   record.actions.includes('update')
// );
// console.log('result: %o', JSON.stringify(result));
