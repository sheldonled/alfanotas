/**
 * Classe para controlar IndeedDB
 */
function MySqlDB(){
    var db = openDatabase('alfanotas', '1.0', 'Banco de dados de notas', 2 * 1024 * 1024),
        strTables = 'nome, n1v, n1c,n2v, n2c,n3v, n3c,n4v, n4c,status, created, modified';
    
    /**
     * Testa se o banco já foi iniciado
     */
    this.dbOk = function() {
        //Ter certeza de retornar booleano
        return !(!db);
    };
    
    /**
     * Configurações Iniciais do banco
     */
    this.init = function() {
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS disciplinas (id INTEGER PRIMARY KEY AUTOINCREMENT, '+strTables+')');
            tx.executeSql('SELECT * FROM disciplinas', [], function (tx, results) {
              if (results.rows.length <= 0) {
                  exemplo1 = {
                        disciplina: 'Estatística', 
                        n1: {
                            value: 2,
                            calc: 0,
                        }, 
                        n2: {
                            value: 0,
                            calc: 0,
                        }, 
                        n3: {
                            value: 0,
                            calc: 0,
                        }, 
                        n4: {
                            value: 0,
                            calc: 0,
                        },
                        status: '',
                        created: Date.now(),
                        modified: Date.now()
                }
                tx.executeSql('INSERT INTO disciplinas ('+strTables+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                              [
                                  exemplo1.disciplina, 
                                  exemplo1.n1.value,
                                  exemplo1.n1.calc,
                                  exemplo1.n2.value,
                                  exemplo1.n2.calc,
                                  exemplo1.n3.value,
                                  exemplo1.n3.calc,
                                  exemplo1.n4.value,
                                  exemplo1.n4.calc,
                                  exemplo1.status,
                                  exemplo1.created,
                                  exemplo1.modified
                              ]);  
              }
            });
        });
    };
    
    /**
     * Configurações Iniciais do banco
     */
    this.listAll = function (cb) {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM disciplinas', [], function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    cb(null, 
                       {
                            id: results.rows.item(i).id, 
                            disciplina: results.rows.item(i).nome, 
                            n1: {
                                value: results.rows.item(i).n1v,
                                calc: parseInt(results.rows.item(i).n1c),
                            }, 
                            n2: {
                                value: results.rows.item(i).n2v,
                                calc: parseInt(results.rows.item(i).n2c),
                            }, 
                            n3: {
                                value: results.rows.item(i).n3v,
                                calc: parseInt(results.rows.item(i).n3c),
                            }, 
                            n4: {
                                value: results.rows.item(i).n4v,
                                calc: parseInt(results.rows.item(i).n4c),
                            },
                            status: results.rows.item(i).status,
                            created: results.rows.item(i).created,
                            modified: results.rows.item(i).modified
                        });
                 }
            });
        });
    };

    /**
     * Salva ou atualiza o registro no banco
     */
    this.save = function (theObject, cb) {
        if (theObject.id) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE disciplinas SET nome=?,n1v=?,n1c=?,n2v=?,n2c=?,n3v=?,n3c=?,n4v=?,n4c=?,status=?,created=?,modified=? WHERE id=?',
                              [
                                  theObject.disciplina, 
                                  theObject.n1.value,
                                  theObject.n1.calc,
                                  theObject.n2.value,
                                  theObject.n2.calc,
                                  theObject.n3.value,
                                  theObject.n3.calc,
                                  theObject.n4.value,
                                  theObject.n4.calc,
                                  theObject.status,
                                  theObject.created,
                                  Date.now,
                                  theObject.id
                              ]);  
            });
        } else {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO disciplinas ('+strTables+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                            [
                                  theObject.disciplina, 
                                  theObject.n1.value,
                                  theObject.n1.calc,
                                  theObject.n2.value,
                                  theObject.n2.calc,
                                  theObject.n3.value,
                                  theObject.n3.calc,
                                  theObject.n4.value,
                                  theObject.n4.calc,
                                  theObject.status,
                                  theObject.created,
                                  theObject.modified
                            ],
                            function(tx, results){
                                theObject.id = results.insertId;
                            });  
            });
        }
        
        if(cb != undefined){
            cb(null, theObject);
        }
    };
    
    /**
     * Deleta o registro
     */
    this.del = function (theId, cb) {
        console.log("Apagando");
        if (theId) {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM disciplinas WHERE id=?', [theId]);  
            });
            if (cb != undefined){
                cb();
            }
        }
    };
}