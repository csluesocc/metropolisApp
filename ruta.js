// variable de conecxion
var db;

function initializeDB() {
	if (window.indexedDB) {
	  console.log("IndexedDB support is there");
	}
	else {
	   alert("Indexed DB is not supported. Where are you trying to run this ? ");
	}
 
	// abrir base de datos
	// primer parametro : nombre de la base. usamos 'rutadb'
	// segundo la version de la base
	var request = indexedDB.open('rutadb', 1);
	
	request.onsuccess = function (e) {
	  // el resultado de la conexion de la db
	  db = e.target.result;
	  //metodo alternativo si da error la conexion
	}
	 
	request.onerror = function (e) {
	   console.log(e);
	};
	 
	// metodos al hacer cambios en la version de la base de datos
	// solo podemos crear colecciones de datos para almacenarlos
	request.onupgradeneeded = function (e) {
	   // resultado se mantiene la conexión con la base de datos
	   db = e.target.result;
	   
	   if (db.objectStoreNames.contains("ruta")) {
	     db.deleteObjectStore("ruta");
	   }
		
	   //crear una coleccion de datos llamada 'ruta' 
//1er parámetro es el nombre de la conexion 
//propio valor proporcionado también.
	   var objectStore = db.createObjectStore('ruta', { keyPath: 'id', autoIncrement: true });
	   
	   console.log("Object Store has been created");
	};
}

$(document).ready(function(){

		//Inicializamos la base de datos
       initializeDB();

	   $("#btnAddNote").click(function(){
		  //cambiamos a  add-notes
		  $.mobile.changePage ($("#add-notes"));
		});

		$("#btnViewNotes").click(function(){
		  //Cambiamos a add-notes
          $.mobile.changePage ($("#view-notes"));
		  //Vacíe la lista primero
		  $("#note-list").html("");
		  //leemos los datos guardados
    	  var transaction = db.transaction([ 'ruta' ]);
		  var store = transaction.objectStore('ruta');
		
  		  // abrimos un cursor que navega en los items alamacenados
		  store.openCursor().onsuccess = function (e) {
			  var cursor = e.target.result;
			  if (cursor) {
			    var value = cursor.value;
		 		var noteElement = $("<div data-role='collapsible' data-mini='true'/>");
				var h3NoteTitle = $("<h3/>").text(value.title);
				var pNoteDetails = $("<p/>").text("Destion: " + value.details);
				var pNoteAuthor = $("<p/>").text("Costo: " + value.author);
				var pNoteTel = $("<p/>").text("Horario: " + value.tel);
				noteElement.append(h3NoteTitle);
				noteElement.append(pNoteDetails);
				noteElement.append(pNoteAuthor);
				noteElement.append(pNoteTel);
				$("#note-list").append(noteElement);
			 
			    // mover al siguiente item
				cursor.continue();
			  }
			  $('div[data-role=collapsible]').collapsible({refresh:true});
			};
	    });
		
		//boton con onclick que muestra los datos
		$("#btnSaveNote").click(function(){
		  noteTitle = $("#noteTitle").val();
		  noteDetails = $("#noteDetails").val();
		  noteAuthor = $("#noteAuthor").val();
		  noteTel = $("#noteTel").val();


		   // crear la transacción con 1er parámetro es la lista de las colecciones y el segundo especifica
		   var transaction = db.transaction([ 'ruta' ], 'readwrite');
		   
		   //crea un objeto para guardar los datos
		   var value = {};
		   value.title = noteTitle;
		   value.details = noteDetails;
		   value.author = noteAuthor;
		   value.tel = noteTel;
		   
		   // agrega datos a la coleccion
		   var store = transaction.objectStore('ruta');
		   var request = store.add(value);
		   request.onsuccess = function (e) {
			  alert("¡Exito! su Ruta a Sido guardada");
		   };
		   request.onerror = function (e) {
		     alert("Error in saving the note. Reason : " + e.value);
		   }
	    });
		
		$("#btnClearNotes").click(function(){
		  $("#noteTitle").val("");
		  $("#noteDetails").val("");
		  $("#noteAuthor").val("");
		  $("#noteTel").val("");
		  $("#noteTitle").focus();
	    });
		
		//Click que borrra los datos
		$("#clearAllNotesBtn").click(function(){
		   
		   var transaction = db.transaction([ 'ruta' ], 'readwrite');
		   var store = transaction.objectStore('ruta');
		   
		   //borra los datos
		   //alternativamente si conoce la ID, puede utilizar store.delete (ID) 
		   request.onsuccess = function () {
			   $("#note-list").html("");
			   alert("Sus Rutas favoritas an sido Borradas");
		   }
		   request.onerror = function (e) {
			   alert("Error while deleting notes : " + e.value);
			};
		});
});	
