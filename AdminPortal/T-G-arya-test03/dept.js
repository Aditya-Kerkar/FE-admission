var addDeptCont = document.getElementById('add-dept-cont');
var importCont = document.getElementById('import-cont')

var addDeptBtn = document.getElementById('add-department')
var importBtn = document.getElementById('import-btn')

importBtn.addEventListener('click', function(){
    addDeptCont.style.display = 'none';
    importCont.style.display = 'block';
})

addDeptBtn.addEventListener('click', function(){
    addDeptCont.style.display = 'block'
    importCont.style.display = 'none'
})