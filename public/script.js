let chartInstance = null

function fillQuestion(q){
document.getElementById("question").value = q
}

async function ask(){

const question = document.getElementById("question").value.trim()

if(!question){
document.getElementById("answer").innerText = "Please ask a question."
return
}

document.getElementById("answer").innerText = "Analyzing data..."

try{

const res = await fetch("/ask",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({question})
})

const data = await res.json()

document.getElementById("answer").innerText =
data.answer || "No insight found."

createChart(data.data)

}catch(err){

console.error(err)

document.getElementById("answer").innerText =
"Something went wrong."

}

}

function createChart(rows){

const revenueByProduct = {}

rows.forEach(r=>{
const product = r.product
revenueByProduct[product] =
(revenueByProduct[product] || 0) + Number(r.revenue)
})

const labels = Object.keys(revenueByProduct)
const values = Object.values(revenueByProduct)

const ctx = document.getElementById("chart").getContext("2d")

if(chartInstance){
chartInstance.destroy()
}

chartInstance = new Chart(ctx,{

type:"bar",

data:{
labels:labels,
datasets:[{
label:"Revenue by Product",
data:values
}]
},

options:{
responsive:true
}

})

}