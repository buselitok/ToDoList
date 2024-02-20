let formDOM = document.querySelector(".form-control")
let buttonDOM = document.querySelector(".btn")
let listDOM = document.querySelector(".todo-list")
let filterDOM = document.querySelector(".todo-filter")




const alertDOM = document.querySelector(".alert-danger");

buttonDOM.addEventListener("click", addToDo)
listDOM.addEventListener("click", deleteToDo) //silme butonuna da işlev kazandırıyoruz
filterDOM.addEventListener("click", filterToDo)


const myList = document.querySelector('ul');

// Sayfa yüklendiğinde localStorage'dan verileri al
document.addEventListener("DOMContentLoaded", function () {
    loadTodosFromLocalStorage();
});


function addToDo(event) {
    event.preventDefault(); //butona her basıldığında sayfanın yenilenmesini önlüyoruz

    if (formDOM.value.trim() == "") {  //listeye boş ekleme yapılmaya çalışılıyorsa bunun önüne geçiyoruz. 
        //Trim sayesinde de sadece boşluk tuşuna basarak listeye ekleme yapılması engelleniyor
        alertDOM.style.display = "block";
        setTimeout(() => {
            alertDOM.style.display = "none";
        }, 1500);
        formDOM.value = "";
    }
    else {
        createToDo(formDOM.value);
        saveTodoToLocalStorage(formDOM.value);

        formDOM.value = "";

    }
    
}

function createToDo(todoText) {
    const TODO_DIV = document.createElement("div")
    TODO_DIV.classList.add("todo")

    const NEW_TODO = document.createElement("li")
    NEW_TODO.innerHTML = todoText
    NEW_TODO.classList.add("todo-item")
    TODO_DIV.appendChild(NEW_TODO)
    
     //Bu kodla birlikte liste öğemizin üzerina bastığımızda css kodunu da kullanarak hem liste öğesinin opaklığını azaltıyor hem de yazının üzerini çiziyor
    TODO_DIV.addEventListener("click", function () {
        TODO_DIV.classList.toggle("completed");
    });

    const TRASH_BUTTON = document.createElement("button")
    TRASH_BUTTON.innerHTML = `<i class="fa fa-minus-circle"></i>`;
    TRASH_BUTTON.classList.add("trash-btn")
    TODO_DIV.appendChild(TRASH_BUTTON)

    listDOM.appendChild(TODO_DIV)
    
}

function deleteToDo(event) {
    const item = event.target; //tıklanan nesneyi alıyoruz

    // Eğer tıklanan öğe bir silme butonu değilse, işlemi sonlandır
    if (!item.classList.contains("trash-btn")) {  //bu kontrol trash buton harici tıklanırsa fonksiyonun çalışmamasını sağlıyor
        return;
    }

    const todo = item.parentElement; //Silme butonuna tıklanan durumda, bu butonun üst (parent) öğesini alır yani div
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {  //Bu fonksiyonla birlikte listeden silme işlemi yapılırken csste efektini eklediğimiz işlem yapılır
        todo.remove();
        removeTodoFromLocalStorage(todo.querySelector(".todo-item").innerHTML);
    })
}

function filterToDo(event) {
    const todos = listDOM.childNodes
    todos.forEach(function (item){
        switch (event.target.value) {
            case "All":   //tümü seçeneği seçiliyse 
                item.style.display = "flex" //hepsini görünür kılar
                break;
            case "Completed": //sadece tamamladıklarım seçiliyse
                if (item.classList.contains("completed")) {
                    item.style.display = "flex" //tamamlanmış olanları olanları gösterir
                }
                else {
                    item.style.display = "none" //tamamlanmamış olanlar görünmez
                }
                break;
            case "Uncompleted": //tamamlanmamışlar seçiliyse
                if (!item.classList.contains("completed")) {  //tamamlanmamış olanları görünür kılar
                    item.style.display = "flex" 
                }
                else {
                    item.style.display = "none" //tamamlanmış olanları göstermez
                }
                break;

        }
    })
}

// Local Storage'dan verileri alıp listeye ekleyen fonksiyon
function loadTodosFromLocalStorage() {
    // localStorage'dan "todos" anahtarı altındaki veriyi alır, JSON.parse ile parçalar
    // Eğer veri yoksa veya boşsa varsayılan olarak boş bir dizi alır
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Önce mevcut liste öğelerini temizle
    listDOM.innerHTML = "";
    
    // Her todo'yu liste üzerine ekler
    todos.forEach(function (todoText) {
        createToDo(todoText);
    });
}
// Local Storage'a veriyi ekleyen fonksiyon
function saveTodoToLocalStorage(todoText) {
    // localStorage'dan "todos" anahtarı altındaki veriyi alır, JSON.parse ile parçalar
    // Eğer veri yoksa veya boşsa varsayılan olarak boş bir dizi alır
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    
    // Yeni todo'yu dizinin sonuna ekler
    todos.push(todoText);

    // localStorage'a "todos" anahtarı altına güncellenmiş diziyi JSON.stringify ile ekler
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Local Storage'dan veriyi silen fonksiyon
function removeTodoFromLocalStorage(todoText) {
    // localStorage'dan "todos" anahtarı altındaki veriyi alır, JSON.parse ile parçalar
    // Eğer veri yoksa veya boşsa varsayılan olarak boş bir dizi alır
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Silinen todo'nun içeriğine sahip olan öğeyi diziden filtreler
    const filteredTodos = todos.filter(todo => todo !== todoText);

    // Güncellenmiş diziyi localStorage'a "todos" anahtarı altına JSON.stringify ile ekler
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}
