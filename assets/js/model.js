var dbName = "minds";
var dbVersion = 1;

var db;
var request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event){
	console.log("Não foi possível abrir o banco de dados", event);
};

request.onsuccess = function(event){
	console.log("Conexão com o banco OK!");
	db = event.target.result;
};

request.onupgradeneeded = function(event){
	console.log("OnUpgradeNeeded");
	db = event.target.result;
	if(!db.objectStoreNames.contains("minds")) {
		console.log("Criando objectStore para minds");

		var objectStore = db.createObjectStore("minds", {
			keyPath: "id",
			autoIncrement: true
		});
		objectStore.createIndex("title", "title", {
			unique:false
		});
		console.log("Adicionando exemplo de nota");
		var sampleMemo1 = new Memo();
		sampleMemo1.title = "Bem vindo!";
		sampleMemo1.content = "Este é um aplicativo de anotações. Use o '+' para adicionar uma anotação" +
		"e clique em uma anotação para editá-la, (ou apagá-la). Todas as anotações são salvas automaticamente";
		objectStore.add(sampleMemo1);
	}
}

function Memo() {
	this.title = "Nota sem Título";
	this.content = "";
	this.created = Date.now();
	this.modified = Date.now();
}

function listAllMemoTitles(inCallback) {
	var objectStore = db.transaction("minds").objectStore("minds");
	console.log("listando notas...");

	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if(cursor) {
			console.log("Encontrada nota #" + cursor.value.id + " - " + cursor.value.title);
			inCallback(null, cursor.value);
			cursor.continue();
		}
	}
}

function saveMemo(inMemo, inCallback) {
	var transaction = db.transaction(["minds"], "readwrite");
	console.log("Salvando a nota");
	transaction.oncomplete = function(event){
		console.log("Pronto!");
	};
	transaction.onerror = function(event) {
		console.error("Erro ao salvar nota: ", event);
		inCallback({
			error : event
		}, null);
	};

	var objectStore = transaction.objectStore("minds");

	inMemo.modified = Date.now();

	var request = objectStore.put(inMemo);
	request.onsuccess = function(event){
		console.log("Nota salva com id:" + request.result);
		inCallback(null, request.result);
	};
}

function deleteMemo(inId, inCallback) {
	console.log("Apagando nota");
    var request = db.transaction(["minds"], "readwrite").objectStore("minds").delete(inId);
    request.onsuccess = function (event) {
        console.log("Nota apagada!");
        inCallback();
    };
}
