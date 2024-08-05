document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form') as HTMLFormElement;
    const itemList = document.getElementById('item-list') as HTMLUListElement;
    const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

itemForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    const itemName:HTMLInputElement = document.querySelector('#item-name'); 
    const itemWeight:HTMLInputElement = document.querySelector('#item-weight');
    const itemMinWeight:HTMLInputElement = document.querySelector('#item-minValue');
    const itemMiddWeight:HTMLInputElement = document.querySelector('#item-midValue')
    
    const item = new Parameters(itemName.value, parseFloat(itemWeight.value), parseFloat(itemMinWeight.value), parseFloat(itemMiddWeight.value));
    if (isNaN(item.weight) || isNaN(item.minValue) || isNaN(item.midValue) || item.weight < 0 || item.minValue < 0 || item.midValue < 0) {
        errorMessage.textContent = 'Invalid input. Please enter a positive number for weight and minimum value.';
        return;
    }
    item.addItem();
/*    
        if(isNaN(Weight) || isNaN(MinWeight) || Weight <= 0 || MinWeight <= 0){
        errorMessage.textContent = 'Invalid input. Please enter a positive number for weight and minimum value.';
        return;
    } */
    
    itemName.value = '';
    itemWeight.value = '';
    itemMinWeight.value = '';
    itemMiddWeight.value = '';


})

const Parameters = function (name:string, weight:number, minValue:number, midValue:number) {
    this.name = name;
    this.weight = weight;
    this.minValue = minValue;
    this.midValue = midValue;
    this.addItem = () => {
        itemList.innerHTML += `<li class='mb-8 max-w-md mx-auto p-4 bg-white rounded shadow-md border border-gray-300 transform transition-transform duration-200 hover:scale-105'>${this.name} - Weight: ${this.weight} kg, Min Value: ${this.minValue} kg, Middle Value:${this.midValue}</li>`;
    }
}












})