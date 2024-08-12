document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form') as HTMLFormElement;
    const itemList = document.getElementById('item-list') as HTMLUListElement;
    const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

    
    function createListItem(name: string, weight: number, minValue: number, midValue: number, id: string) {
        const listItem = document.createElement('li');
        listItem.className = 'relative mb-8 max-w-md mx-auto p-4 bg-green-400 list-none rounded shadow-md border border-gray-300 transform';
        
        const contentWrapper = document.createElement('div');
        const itemText = document.createElement('span');
        itemText.className = 'mr-4';
        itemText.textContent = `${name} - Weight: ${weight} kg`;
        contentWrapper.appendChild(itemText);
        
        const buttonMinus = document.createElement('button');
        buttonMinus.className = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l';
        buttonMinus.textContent = '-';
        contentWrapper.appendChild(buttonMinus);
        
        const buttonPlus = document.createElement('button');
        buttonPlus.className = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r';
        buttonPlus.textContent = '+';
        contentWrapper.appendChild(buttonPlus);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded';
        const icon = document.createElement('box-icon');
        icon.setAttribute('name', 'trash');
        deleteButton.appendChild(icon);
        contentWrapper.appendChild(deleteButton);
        
        listItem.appendChild(contentWrapper);
        listItem.setAttribute('data-id', id);
        itemList.appendChild(listItem);
        

        buttonPlus.addEventListener('click', () => {
            weight += 1;
            updateItem(id, name, weight, minValue, midValue);
            itemText.textContent = `${name} - Weight: ${weight} kg`;
            updateBackgroundColor(listItem, weight, minValue, midValue);
        });
        
        buttonMinus.addEventListener('click', () => {
            weight -= 1;
            updateItem(id, name, weight, minValue, midValue);
            itemText.textContent = `${name} - Weight: ${weight} kg`;
            updateBackgroundColor(listItem, weight, minValue, midValue);
        });
        
        deleteButton.addEventListener('click', () => {
            console.log(`Deleting item with id: ${id}`);  
            removeItem(id, listItem);
        });

        updateBackgroundColor(listItem, weight, minValue, midValue);
    }

    
    function updateItem(id: string, name: string, weight: number, minValue: number, midValue: number) {
        localStorage.setItem(id, JSON.stringify({ name, weight, minValue, midValue, id }));
    }

    
    function updateBackgroundColor(listItem: HTMLLIElement, weight: number, minValue: number, midValue: number) {
        if (weight > midValue) {
            listItem.classList.remove('bg-yellow-300');
            listItem.classList.add('bg-green-400');
        } else if (weight > minValue && weight <= midValue) {
            listItem.classList.remove('bg-green-400');
            listItem.classList.add('bg-yellow-300');
        } else {
            listItem.classList.remove('bg-yellow-300', 'bg-green-400');
            listItem.classList.add('bg-red-400');
        }
    }

    function removeItem(id: string, listItem: HTMLLIElement) {
        localStorage.removeItem(id);
        listItem.remove();
        console.log(`Removed item with id: ${id}`);  // Debug log
    }

    
    function loadItems() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            const itemData = localStorage.getItem(key);
            if (itemData) {
                const { name, weight, minValue, midValue, id } = JSON.parse(itemData);
                if (itemData && id) {
                    console.log(`Loading item with id: ${id}`);  // Debug log
                    createListItem(name, weight, minValue, midValue, id);
                }
            }
        });
    }

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = (document.querySelector('#item-name') as HTMLInputElement).value;
        const itemWeight = parseFloat((document.querySelector('#item-weight') as HTMLInputElement).value);
        const itemMinWeight = parseFloat((document.querySelector('#item-minValue') as HTMLInputElement).value);
        const itemMiddWeight = parseFloat((document.querySelector('#item-midValue') as HTMLInputElement).value);

        if (isNaN(itemWeight) || isNaN(itemMinWeight) || isNaN(itemMiddWeight) || itemWeight < 0 || itemMinWeight < 0 || itemMiddWeight < 0) {
            errorMessage.textContent = 'Invalid input. Please enter positive numbers for weight and values.';
            return;
        } else if (itemWeight < itemMinWeight || itemMinWeight > itemMiddWeight || itemMiddWeight > itemWeight) {
            errorMessage.textContent = 'Invalid input. Please enter valid weight and values.';
            return;
        }

        const id = Date.now().toString();
        createListItem(itemName, itemWeight, itemMinWeight, itemMiddWeight, id);
        updateItem(id, itemName, itemWeight, itemMinWeight, itemMiddWeight);

        errorMessage.textContent = "";
        (document.querySelector('#item-name') as HTMLInputElement).value = '';
        (document.querySelector('#item-weight') as HTMLInputElement).value = '';
        (document.querySelector('#item-minValue') as HTMLInputElement).value = '';
        (document.querySelector('#item-midValue') as HTMLInputElement).value = '';
    });

    
    loadItems();
});
