module.exports = function(database, data) {
    const databaseType = database.includes('MySQL') ? 'mysql' : 'postgresql'

    let type = `const joinMonster = require('join-monster').default;
const getConnection = require('../db/${databaseType}_pool');

module.exports = {`;
    let query = '\n\tQuery: {'
    let mutation = '\n\n\tMutation: {'

    let firstLoop = true;
    let firstType = true;
    for ( const tableIndex in data) {
        const table = data[tableIndex];
        
        //To find the primary key
        let firstPrimaryKey = '';
        for (const index in table.fields) {
            const field = table.fields[index];
            if (field.primaryKey) {
                firstPrimaryKey = field.name;
                break;
            }
        }

        if (!firstLoop) {
            query += ',';
            mutation += ',';
        }
        firstLoop = false;

        type += `\n\t${table.type}: {`;

        query += `\n\t\tevery${table.type}: (parent, args, ctx, info) => {
            return joinMonster(info, args, sql => {`
            if(database.includes('MySQL')) {
                query += `
                getConnection((err, con) => {
                    con.query(sql, (err, result) => {
                        if (err) throw err;
                        con.release();
                        return result;
                    })
                })
            })
        }`
            } else {
                query += `
                getConnection((err, con, release) => {
                    con.query(sql, (err, result) => {
                        if (err) throw err;
                        release();
                        return result;
                    })
                })
            })
        }`
            }

    mutation += `\n\t\tcreate${table.type}: (parent, args) => {
            let columns = '';
            let values = '';
            const sql = \`INSERT INTO ${table.type} (\${columns}) VALUES (\${values})\`;
            
            let firstLoop = true;
            for (const prop in args) {
                if (prop !== 'id') {
                    if (!firstLoop) {
                        columns += ', ';
                        values += ', ';
                    }
                    firstLoop = false;
                    columns += prop;
                    values += args[prop];
                }
            }
            `
            if(database.includes('MySQL')) {
                mutation += `
            getConnection((err, con) => {
                con.query(sql, (err, result) => {
                    if (err) throw err;
                    con.release();
                    return result;
                })
            })
        },`
            } else {
                mutation += `
            getConnection((err, con, release) => {
                con.query(sql, (err, result) => {
                    if (err) throw err;
                    release();
                    return result;
                })
            })
        },`
            }

        mutation += `
        update${table.type}: (parent, args) => {
            let updateValues = '';
            const sql = \`UPDATE ${table.type} SET \${updateValues} WHERE ${firstPrimaryKey} = \${args.${firstPrimaryKey}}\`;

            let firstLoop = true;
            for (const prop in args) {
                if (prop !== 'id') {
                    if (!firstLoop) {
                        updateValues += ', ';
                    }
                    firstLoop = false;
                    updateValues += \`\${prop} = '\${args[prop]}'\`
                }
            }
            `
            if(database.includes('MySQL')) {
                mutation += `
            getConnection((err, con) => {
                con.query(sql, (err, result) => {
                    if (err) throw err;
                    con.release();
                    return result;
                })
            })
        },`
            } else {
                mutation += `
            getConnection((err, con, release) => {
                con.query(sql, (err, result) => {
                    if (err) throw err;
                    release();
                    return result;
                })
            })
        },`
            }

        mutation += `
        delete${table.type}: (parent, { ${firstPrimaryKey} }) => {
            const sql = \`DELETE FROM ${table.type} WHERE ${firstPrimaryKey} = \${${firstPrimaryKey}}\`;`

            if(database.includes('MySQL')) {
                mutation += `
            getConnection((err, con) => {
                con.query(sql, (err, result) => {
                    if (err) throw err;
                    con.release();
                    return result;
                })
            })
        }`
            } else {
                mutation += `
            getConnection((err, con, release) => {
                con.query(sql, (err, result) => {
                    if (err) throw err;
                    release();
                    return result;
                })
            })
        }`
            }

        for ( const fieldIndex in table.fields ) {
            const field = table.fields[fieldIndex];

            if (field.primaryKey) {
                query += `,\n\t\tget${table.type}By${toTitleCase(field.name)}: (parent, args, ctx, info) => {
            return joinMonster(info, args, sql => {`

                if(database.includes('MySQL')) {
                    query += `
                getConnection((err, con) => {
                    con.query(sql, (err, result) => {
                        if (err) throw err;
                        con.release();
                        return result;
                    })
                })
            })
        }`
                } else {
                    query += `
                getConnection((err, con, release) => {
                    con.query(sql, (err, result) => {
                        if (err) throw err;
                        release();
                        return result;
                    })
                })
            })
        }`
                }
            }

            // if (field.relation.tableIndex > -1) {
            //     const { tableIndex, fieldIndex, refType } = field.relation;
            //     const refTable = data[tableIndex].type;
            //     //const refField = data[tableIndex].fields[fieldIndex].name;

            //     if (!firstType) {
            //         type += ',';
            //     }
            //     firstType = false;

            //     type += `\n\t\t${isMultipleNameType(refType)}${refTable}: ({ ${field.name} }, args, ctx) => ,`
            // }

            // if (Array.isArray(field.refBy)) {
            //     field.refBy.forEach((ref, i) => {
            //         if (i) query += '\n';
            //     const parsedValue = ref.split('.');
            //     const tableIndex = parsedValue[0];
            //     //const fieldIndex = parsedValue[1];
            //     const refType = parsedValue[2];
            //     const refTable = data[tableIndex].type;
            //     //const refField = data[tableIndex].fields[fieldIndex].name;

            //     type += `\n\t\t${isMultipleNameType(refType)}${refTable}: ({ ${field.name} }, args, ctx) => ,`
            //   });

            // } 
        }
        type += '\n\t},\n'
    }
    query += '\n\t},'
    return type += query += mutation += '\n\t}\n};';
};




function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


function isMultipleNameType(data) {
    if ( data === 'one to one' || data === 'many to one') return 'related'
    return 'everyRelated'
}


// function findSearchType(type) {
//     if ( type === 'one to many' ) return 'findAll';
//     return 'findOne'
// }