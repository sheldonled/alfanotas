/**
 * Classe para controlar IndeedDB
 */
function MyDB(){
    //Onde tiver 'alfanotas' substituir pelo nome do seu banco
    idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var db,
        request = idb.open("alfanotas", 1);
    
    /**
     * Testa se o banco já foi iniciado
     */
    this.dbOk = function() {
        //Ter certeza de retornar booleano
        return !(!db);
    };
    
    /**
     * Mostra mensagem de erro
     */
    request.onerror = function(event) {
      // Alerta de erro
      alert("Database error: " + event.target.errorCode);
    };
    
    /**
     * Testa se o banco já foi iniciado
     */
    request.onsuccess = function(event){
        console.log("Conexão OK!");
        db = event.target.result;
    };
    
    /**
     * Faz configurações iniciais do banco
     */
    request.onupgradeneeded = function(event){
        console.log("Criando/Atualizando Banco");
        db = event.target.result;
        
        /**
         * Criando objectStore para alfanotas
         */
        var objectStore = db.createObjectStore("alfanotas", {
            keyPath: "id",
            autoIncrement: true
        });
        
        //Criando o índice
        objectStore.createIndex("disciplina", "disciplina", {
            unique:false
        });
        
        //Criando exemplos de disciplina
        var exemplos = [
	        {
                disciplina: 'Estatística', 
                n1: {
                    value: 2,
                    calc: false,
                }, 
                n2: {
                    value: 0,
                    calc: false,
                }, 
                n3: {
                    value: 0,
                    calc: false,
                }, 
                n4: {
                    value: 0,
                    calc: false,
                },
                status: '',
                created: Date.now(),
                modified: Date.now()
            },
	        {
                disciplina: 'Metodologia Científica', 
                n1: {
                    value: 6,
                    calc: false,
                }, 
                n2:  {
                    value: 8,
                    calc: false,
                }, 
                n3:  {
                    value: 0,
                    calc: false,
                },
                n4:  {
                    value: 0,
                    calc: false,
                },
                status : '',
                created: Date.now(),
                modified: Date.now()
            }
	    ];
        
        //Adicionando exemplos criados
        objectStore.transaction.oncomplete = function(event) {
            // Armazenando valores no novo objectStore.
            var discObjectStore = db.transaction("alfanotas", "readwrite").objectStore("alfanotas");
            for (var i in exemplos) {
                discObjectStore.add(exemplos[i]);
            }
        };
    };

    /**
     * Lista todos os registros, chamando o callback para cada registro
     * PS: Bom para fazer array.push
     */
    this.listAll = function (inCallback) {
        var objectStore = db.transaction("alfanotas").objectStore("alfanotas");
        console.log("listando...");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
                if (inCallback != undefined){
                    inCallback(null, cursor.value);
                }
                cursor.continue();
            }
        }
    }

    /**
     * Salva o registro no banco
     */
    this.save = function (theObject, inCallback) {
        //abre a transação
        var transaction = db.transaction(["alfanotas"], "readwrite");
        //alerta quando a transação for completa
        transaction.oncomplete = function(event){
            console.log("Pronto!");
        };
        //alera para erros
        transaction.onerror = function(event) {
            console.error("Erro ao salvar: ", event);
            if (inCallback != undefined) {
                inCallback({
                    error : event
                }, null);
            }
        };
        var objectStore = transaction.objectStore("alfanotas");
        if (!theObject.created) {
            theObject.created = Date.now();
        }
        theObject.modified = Date.now();
        
        //Adicionando o registro
        var request = objectStore.put(theObject);
        request.onsuccess = function(event){
            console.log("Salvando com id:" + request.result);
            if(inCallback != undefined){
                objectStore.get(request.result).onsuccess = function(event) {
                    inCallback(null, event.target.result);
                };
            }
        };
    }
    
    /**
     * Deleta o registro
     */
    this.del = function (theId, inCallback) {
        console.log("Apagando");
        //Criando a transação
        var request = db.transaction(["alfanotas"], "readwrite").objectStore("alfanotas").delete(theId);
        //Retornando mensagem de sucesso
        request.onsuccess = function (event) {
            console.log("Objeto Apagado!");
            if (inCallback != undefined){
                inCallback();
            }
        };
    }
}