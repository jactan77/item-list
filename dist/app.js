document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form');
    const itemList = document.getElementById('item-list');
    const errorMessage = document.getElementById('error-message');
    const Parameters = function (name, weight, minValue, midValue) {
        this.name = name;
        this.weight = weight;
        this.minValue = minValue;
        this.midValue = midValue;
        this.addItem = () => {
            const listItem = document.createElement('li');
            listItem.className = 'mb-8 max-w-md mx-auto p-4 bg-green-400 rounded shadow-md border border-gray-300 transform transition-transform duration-200 hover:scale-105';
            listItem.textContent = `${this.name} - Weight: ${this.weight} kg`;
            listItem.setAttribute('data-id', Date.now().toString());
            itemList.appendChild(listItem);
            listItem.addEventListener('click', () => {
                const itemId = listItem.getAttribute('data-id');
                let text = localStorage.getItem(itemId);
                let obj = JSON.parse(text);
                const newWeight = prompt("New weight:", obj.weight);
                if (newWeight === null || newWeight.trim() === "" || isNaN(parseFloat(newWeight)) || parseFloat(newWeight) < 0) {
                    errorMessage.textContent = 'Invalid input. Please enter a positive number for weight.';
                    return;
                }
                obj.weight = parseFloat(newWeight);
                localStorage.setItem(itemId, JSON.stringify(obj));
                listItem.textContent = `${obj.name} - Weight: ${obj.weight} kg, Min: ${obj.minValue}, Mid: ${obj.midValue}`;
            });
        };
    };
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = document.querySelector('#item-name');
        const itemWeight = document.querySelector('#item-weight');
        const itemMinWeight = document.querySelector('#item-minValue');
        const itemMiddWeight = document.querySelector('#item-midValue');
        const item = new Parameters(itemName.value, parseFloat(itemWeight.value), parseFloat(itemMinWeight.value), parseFloat(itemMiddWeight.value));
        if (isNaN(item.weight) || isNaN(item.minValue) || isNaN(item.midValue) || item.weight < 0 || item.minValue < 0 || item.midValue < 0) {
            errorMessage.textContent = 'Invalid input. Please enter a positive number for weight and minimum value.';
            return;
        }
        else if (item.weight < item.minValue || item.minValue > item.midValue || item.midValue > item.weight) {
            errorMessage.textContent = 'Invalid input. Please enter a positive number for weight, minimum value.';
            return;
        }
        item.addItem();
        const itemId = Date.now().toString();
        localStorage.setItem(itemId, JSON.stringify(item));
        errorMessage.textContent = "";
        itemName.value = '';
        itemWeight.value = '';
        itemMinWeight.value = '';
        itemMiddWeight.value = '';
        return item.minValue, item.midValue;
    });
});
