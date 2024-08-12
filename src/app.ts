document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form') as HTMLFormElement;
    const itemList = document.getElementById('item-list') as HTMLUListElement;
    const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

    function setCookie(name: string, value: string, days: number) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name: string) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name: string) {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    }

    function getAllCookies() {
        const cookies = document.cookie.split("; ");
        const cookieObj: { [key: string]: string } = {};
        cookies.forEach(cookie => {
            const [name, value] = cookie.split("=");
            cookieObj[name] = decodeURIComponent(value);
        });
        return cookieObj;
    }

    const Parameters = function (name: string, weight: number, minValue: number, midValue: number) {
        this.name = name;
        this.weight = weight;
        this.minValue = minValue;
        this.midValue = midValue;

        this.addItem = (id: string | null = null) => {
            const listItem = document.createElement('li');
            listItem.className = 'relative mb-8 max-w-md mx-auto p-4 bg-green-400 list-none rounded shadow-md border border-gray-300';

            const contentWrapper = document.createElement('div');
            const itemText = document.createElement('span');
            itemText.className = 'mr-4';
            itemText.textContent = `${this.name} - Weight: ${this.weight} kg`;
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
            deleteButton.className = 'absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
            const icon = document.createElement('box-icon')
            icon.setAttribute('name','trash')
            deleteButton.appendChild(icon);
            contentWrapper.appendChild(deleteButton);


            listItem.appendChild(contentWrapper);
            const itemId = id || Date.now().toString();
            listItem.setAttribute('data-id', itemId);
            itemList.appendChild(listItem);

            if (!id) {
                setCookie(itemId, JSON.stringify(this), 7);
            }

            buttonPlus.addEventListener('click', () => {
                const itemId = listItem.getAttribute('data-id');
                let text = getCookie(itemId);
                let obj = JSON.parse(text);
                obj.weight += 1;
                setCookie(itemId, JSON.stringify(obj), 7);
                itemText.textContent = `${obj.name} - Weight: ${obj.weight} kg`;

                if (obj.weight > obj.midValue) {
                    listItem.classList.remove('bg-yellow-300');
                    listItem.classList.add('bg-green-400');
                } else if (obj.weight > obj.minValue && obj.weight <= obj.midValue) {
                    listItem.classList.remove('bg-green-400');
                    listItem.classList.add('bg-yellow-300');
                } else {
                    listItem.classList.remove('bg-yellow-300', 'bg-green-400');
                    listItem.classList.add('bg-red-400');
                }
            });

            buttonMinus.addEventListener('click', () => {
                const itemId = listItem.getAttribute('data-id');
                let text = getCookie(itemId);
                let obj = JSON.parse(text);
                obj.weight -= 1;
                setCookie(itemId, JSON.stringify(obj), 7);
                itemText.textContent = `${obj.name} - Weight: ${obj.weight} kg`;

                if (obj.weight > obj.midValue) {
                    listItem.classList.remove('bg-yellow-300');
                    listItem.classList.add('bg-green-400');
                } else if (obj.weight > obj.minValue && obj.weight <= obj.midValue) {
                    listItem.classList.remove('bg-green-400');
                    listItem.classList.add('bg-yellow-300');
                } else {
                    listItem.classList.remove('bg-yellow-300', 'bg-green-400');
                    listItem.classList.add('bg-red-400');
                }
            });

            deleteButton.addEventListener('click', () => {
                const itemId = listItem.getAttribute('data-id');
                eraseCookie(itemId);
                itemList.removeChild(listItem);
            });
        };
    };

    
    const cookies = getAllCookies();
    for (const itemId in cookies) {
        if (cookies.hasOwnProperty(itemId)) {
            const itemData = JSON.parse(cookies[itemId]);
            const item = new Parameters(itemData.name, itemData.weight, itemData.minValue, itemData.midValue);
            item.addItem(itemId);
        }
    }

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = document.querySelector('#item-name') as HTMLInputElement;
        const itemWeight = document.querySelector('#item-weight') as HTMLInputElement;
        const itemMinWeight = document.querySelector('#item-minValue') as HTMLInputElement;
        const itemMiddWeight = document.querySelector('#item-midValue') as HTMLInputElement;

        const item = new Parameters(itemName.value, parseFloat(itemWeight.value), parseFloat(itemMinWeight.value), parseFloat(itemMiddWeight.value));
        if (isNaN(item.weight) || isNaN(item.minValue) || isNaN(item.midValue) || item.weight < 0 || item.minValue < 0 || item.midValue < 0) {
            errorMessage.textContent = 'Invalid input. Please enter a positive number for weight and minimum value.';
            return;
        } else if (item.weight < item.minValue || item.minValue > item.midValue || item.midValue > item.weight) {
            errorMessage.textContent = 'Invalid input. Please enter a positive number for weight, minimum value.';
            return;
        }
        item.addItem();

        errorMessage.textContent = "";
        itemName.value = '';
        itemWeight.value = '';
        itemMinWeight.value = '';
        itemMiddWeight.value = '';
    });
});
