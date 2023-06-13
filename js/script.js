export default function initialize() {
    const transactionUl = document.querySelector('#transactions');
    const moneyplus = document.getElementById('money-plus');
    const moneyminus = document.getElementById('money-minus');
    const balance = document.getElementById('balance');
    const form = document.querySelector('#form');
    const inputTransactionName = document.querySelector('#text');
    const inputTransactionAmount = document.querySelector('#amount');

    const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
    let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

    const addTransactionDOM = (transaction) => {
        const operator = transaction.amount < 0 ? '-' : '+';
        const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
        const amountWithoutOperator = Math.abs(transaction.amount);
        const li = document.createElement('li');
        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('delete-btn');

        li.classList.add(CSSClass);
        li.innerHTML = `
            ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
        `;
        li.appendChild(buttonDelete);
        transactionUl.appendChild(li);

        buttonDelete.addEventListener('click', () => {
            li.remove();
            removeTransaction(transaction.id);
            window.location.reload(true);
        });
    };

    const updateBalanceValues = () => {
        const transactionAmounts = transactions.map((transaction) => transaction.amount);

        const filterTransactionsPlus = transactions
            .filter((transaction) => transaction.amount > 0 && transaction.name !== 'Salario')
            .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

        moneyplus.textContent = `R$ ${filterTransactionsPlus.toFixed(2)}`;

        const filterTransactionsNegative = transactions
            .filter((transaction) => transaction.amount < 0)
            .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

        moneyminus.textContent = `R$ ${filterTransactionsNegative.toFixed(2)}`;

        const filterBalance = transactions
            .filter((transaction) => transaction.amount > 0 && (transaction.name === 'Salario' || transaction.name === 'salario'))
            .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

        balance.textContent = `R$ ${filterBalance.toFixed(2)}`;
    };

    const removeTransaction = (id) => {
        transactions = transactions.filter((transaction) => transaction.id !== id);
        updateLocalStorage();
    };

    const updateLocalStorage = () => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    const init = () => {
        transactionUl.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateBalanceValues();
    };

    const generateID = () => Math.round(Math.random() * 1000);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (inputTransactionName.value.trim() === '' || inputTransactionAmount.value.trim() === '') {
            alert('Por favor preencha todos os campos');
            return;
        }

        const transaction = {
            id: generateID(),
            name: inputTransactionName.value,
            amount: Number(inputTransactionAmount.value),
        };

        transactions.push(transaction);
        init();
        updateLocalStorage();

        inputTransactionName.value = '';
        inputTransactionAmount.value = '';
    });

    init();
}
