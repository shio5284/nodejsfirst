

/* function myFunction() {
  document.getElementById("demo").style.color = "red";
} */
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("ppmphdrselect");

  if (!select) return;

  select.addEventListener("change", function () {

    
    window.location.href = "/ppmp/" + this.value;
  });
});

document.addEventListener("DOMContentLoaded", function () {

  // EDIT BUTTON CLICK
  document.addEventListener("click", function (e) {

    if (e.target.classList.contains("editBtn")) {

      const btn = e.target;

      document.getElementById("editForm").action =
        "/ppmp/edit/" + btn.dataset.id + "?_method=PUT";

      document.getElementById("editgeneralDescName").value = btn.dataset.generaldescname || "";
      document.getElementById("editQuantity").value = btn.dataset.quantity || "";
      document.getElementById("editunitOfMeasurement").value = btn.dataset.unitmeasurement || "";
      document.getElementById("editstartProc").value = btn.dataset.startproc || "";
      document.getElementById("editendProc").value = btn.dataset.endproc || "";
      document.getElementById("editsourceOfFound").value = btn.dataset.sourceoffund || "";
      document.getElementById("editestimatedBudget").value = btn.dataset.estimatedbudget || "";
      document.getElementById("editprocLawCategoryId").value = btn.dataset.proclawcategoryid || "";
      document.getElementById("editprocurementMode").value = btn.dataset.procurementmode || "";
      document.getElementById("editexpectedDelivery").value = btn.dataset.expecteddelivery || ""; 
      document.getElementById("editattachedSupportingDocs").value = btn.dataset.attachedsupportingdocs || "";
      document.getElementById("editremarks").value = btn.dataset.remarks || "";

       
     
    }




    if (e.target.classList.contains("editBtnapp")) {

      const btn = e.target;

      document.getElementById("editForm").action =
        "/procApp/edit/" + btn.dataset.id + "?_method=PUT";

      document.getElementById("editgeneralDescName").value = btn.dataset.generaldescnameapp || "";
      document.getElementById("editQuantity").value = btn.dataset.quantityapp || "";
      document.getElementById("editunitOfMeasurement").value = btn.dataset.unitmeasurementapp || "";
      document.getElementById("editstartProc").value = btn.dataset.startprocapp || "";
      document.getElementById("editendProc").value = btn.dataset.endprocapp || "";
      document.getElementById("editsourceOfFound").value = btn.dataset.sourceoffundapp || "";
      document.getElementById("editestimatedBudget").value = btn.dataset.estimatedbudgetapp || "";

       document.getElementById("editappCategoryItem").value = btn.dataset.categoryitemapp || "";
        document.getElementById("editprocurementMode").value = btn.dataset.appprocmodes || "";
           document.getElementById("editcriteriaForBidEval").value = btn.dataset.appcriteriabideval || ""; 
      document.getElementById("editprocurementStrat").value = btn.dataset.appproctrac || ""; 
   
      document.getElementById("editappRemarks").value = btn.dataset.appremarks || ""; 
    

 
  




    }

    // DELETE BUTTON CLICK
    if (e.target.classList.contains("deleteBtn")) {

      const btn = e.target;

      document.getElementById("deleteForm").action =
        "/ppmp/delete/" + btn.dataset.id ;

      document.getElementById("deleteName").innerText =
        btn.dataset.name || "";
    }



      if (e.target.classList.contains("deleteBtn")) {

      const btn = e.target;

      document.getElementById("deleteForm").action =
        "/ppmp/delete/" + btn.dataset.id ;

      document.getElementById("deleteName").innerText =
        btn.dataset.name || "";
    }

  });

});




  function toggleExclude(id) {
    fetch(`/items/toggle/${id}`, {
      method: "POST"
    })
    .then(res => res.json())
    .then(() => location.reload());
  }


