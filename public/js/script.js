const darkmode = document.querySelector(".darkmode-toggle");
const body = document.querySelector("body");
const list = document.querySelector(".list");
const counter = document.querySelector(".footer div");
const footer = document.querySelector(".footer");
const input = document.querySelector("input")

/* 🌙 DARK MODE */
darkmode.addEventListener("click", function () {
    body.classList.toggle("darkmode");
    localStorage.setItem("theme", body.classList.contains("darkmode") ? "dark" : "light");
});

/* 🔄 CARREGAMENTO INICIAL */
document.addEventListener("DOMContentLoaded", function () {

    /* Tema */
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("darkmode");
    }

    /* Lista */
    const savedTodos = localStorage.getItem("todoItems");

    if (!savedTodos) {
        salvarLista();
    } else {
        list.innerHTML = "";
        const todoArray = JSON.parse(savedTodos);

        todoArray.forEach(function (todo) {
            const item = document.createElement("div");
            item.classList.add("item");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.done;

            const span = document.createElement("span");
            span.textContent = todo.text;

            if (todo.done) {
                item.classList.add("item-checked");
            }

            item.appendChild(checkbox);
            item.appendChild(span);
            list.appendChild(item);
        });

        atualizarContador();
    }
});

/* ✅ MARCAR / DESMARCAR */
list.addEventListener("click", function (event) {
    if (event.target.tagName === "INPUT") {
        const item = event.target.parentElement;
        item.classList.toggle("item-checked");

        atualizarContador();
        salvarLista();
    }
});

/* 🔢 CONTADOR */
function atualizarContador() {
    const total = document.querySelectorAll(".item").length;
    const checked = document.querySelectorAll(".item-checked").length;
    counter.textContent = (total - checked) + " itens restantes";
}

/* 💾 SALVAR LISTA */
function salvarLista() {
    const items = document.querySelectorAll(".item");
    const todoArray = [];

    items.forEach(function (item) {
        todoArray.push({
            text: item.querySelector("span").textContent,
            done: item.classList.contains("item-checked")
        });
    });

    localStorage.setItem("todoItems", JSON.stringify(todoArray));
}

/* 🧹 FILTROS + LIMPEZA */
footer.addEventListener("click", function (event) {
    event.preventDefault();
    if (event.target.tagName !== "A") return;

    const filter = event.target.getAttribute("href");
    const items = document.querySelectorAll(".item");
    const active = document.querySelectorAll(".footer a")

    active.forEach(function (a) {
        a.classList.remove("active");
    });

    event.target.classList.add("active");

    /* LIMPEZA COMPLETA */
    if (filter === "#clear") {
        document.querySelectorAll(".item-checked").forEach(item => item.remove());
        atualizarContador();
        salvarLista();
        return;
    }

    /* FILTROS */
    items.forEach(function (item) {
        if (filter === "#todos") item.style.display = "";
        if (filter === "#ativos") item.style.display = item.classList.contains("item-checked") ? "none" : "";
        if (filter === "#concluidos") item.style.display = item.classList.contains("item-checked") ? "" : "none";
    });
});

input.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {

        if (input.value.trim() !== "") {
            const item = document.createElement("div");
            item.classList.add("item");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            const span = document.createElement("span");
            span.textContent = input.value;

            item.appendChild(checkbox);
            item.appendChild(span);
            list.appendChild(item);

            input.value = "";
            atualizarContador();
            salvarLista();


        }
    }
});
