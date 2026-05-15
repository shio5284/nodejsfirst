document.addEventListener('DOMContentLoaded', () => {
  const selectedItems = [];

  document.getElementById('searchBox').addEventListener('input', async (e) => {
   

    const query = e.target.value;

    const res = await fetch(`/ppmpPr/search?q=${query}`);
    const data = await res.json();


    const resultsDiv = document.getElementById('results');
resultsDiv.innerHTML = '';

data.forEach(item => {
  const tr = document.createElement('tr');
/*<td>${item.itemCode}</td>*/
  tr.innerHTML = `
    <td>${item.generalDescription}</td>
    <td>${item.unitPrice}</td>
     <td>${item.unitOfMeasurement}</td>
    <td>  <button class="btn select-btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addPrModal">Select</button></td>
  `;

  // safer than inline onclick
  tr.querySelector('.select-btn').addEventListener('click', () => {
    addItem(item.itemCode, item.generalDescription, item.unitPrice, item.unitOfMeasurement);
  });

  resultsDiv.appendChild(tr);
});

   /*  const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    data.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `
       ${item.itemCode} ${item.generalDescription} 
        <button onclick="addItem('${item.itemCode}', '${item.generalDescription}', ${item.unitPrice})">
          Select
        </button>
      `;
      resultsDiv.appendChild(div);
    }); */
  });
});

function addItem(id, name, price, unitmeasurement) {

  
  document.getElementById("itemCodePR").value = id|| "";
  document.getElementById("generalDescName").value = name|| "";
  document.getElementById("PricePerUnit").value = price|| "";
  document.getElementById("UnitofMeasurement").value = unitmeasurement|| "";
}